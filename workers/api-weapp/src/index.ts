import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database; KV: KVNamespace; WX_APPID?: string; WX_SECRET?: string };

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-weapp' }));

// 微信小程序登录
app.post('/api/weapp/login', async (c) => {
  const { code, nick_name, avatar_url } = await c.req.json();
  if (!code) return c.json({ error: '缺少 code' }, 400);

  let openid: string, unionid: string | undefined;

  if (c.env.WX_APPID && c.env.WX_SECRET) {
    const wxResp = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${c.env.WX_APPID}&secret=${c.env.WX_SECRET}&js_code=${code}&grant_type=authorization_code`
    );
    const wxData: any = await wxResp.json();
    if (wxData.errcode) return c.json({ error: '微信登录失败', detail: wxData.errmsg }, 400);
    openid = wxData.openid;
    unionid = wxData.unionid;
  } else {
    // 开发模式 mock
    openid = 'mock_' + crypto.randomUUID();
  }

  // 查找或创建 weapp 用户映射
  let weappUser = await c.env.DB.prepare('SELECT * FROM weapp_users WHERE openid = ?').bind(openid).first() as any;

  if (!weappUser) {
    const userId = crypto.randomUUID();
    await c.env.DB.prepare('INSERT INTO users (id, name, type, status) VALUES (?,?,?,?)')
      .bind(userId, nick_name || '微信用户', 'customer', 'active').run();
    await c.env.DB.prepare('INSERT INTO weapp_users (openid,user_id,nick_name,avatar_url) VALUES (?,?,?,?)')
      .bind(openid, userId, nick_name || null, avatar_url || null).run();
    weappUser = { user_id: userId };
  } else if (nick_name || avatar_url) {
    await c.env.DB.prepare('UPDATE weapp_users SET nick_name=COALESCE(?,nick_name),avatar_url=COALESCE(?,avatar_url) WHERE openid=?')
      .bind(nick_name || null, avatar_url || null, openid).run();
  }

  const user = await c.env.DB.prepare('SELECT id, name, phone, type FROM users WHERE id = ?')
    .bind(weappUser.user_id).first();

  const token = crypto.randomUUID();
  await c.env.KV.put(`session:${token}`, JSON.stringify(user), { expirationTtl: 86400 * 7 });

  return c.json({ success: true, token, user });
});

// 绑定已有账号
app.post('/api/weapp/bind', async (c) => {
  const { openid, phone, password } = await c.req.json();
  const user = await c.env.DB.prepare('SELECT id,name FROM users WHERE phone=? AND password_hash=?')
    .bind(phone, password).first() as any;
  if (!user) return c.json({ error: '账号或密码错误' }, 401);
  await c.env.DB.prepare('UPDATE weapp_users SET user_id=? WHERE openid=?').bind(user.id, openid).run();
  return c.json({ success: true, user_id: user.id });
});

// 获取 WeChat 配置（前端需要 appid）
app.get('/api/weapp/config', (c) => {
  return c.json({ appid: c.env.WX_APPID || 'dev_mode' });
});

export default app;
