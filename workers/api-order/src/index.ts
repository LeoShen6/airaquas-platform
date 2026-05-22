import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = { DB: D1Database; KV: KVNamespace; R2: R2Bucket };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', (c) => c.json({ service: 'airaquas-order' }));

// 创建 B2B 订单（门店采购）
app.post('/api/orders/b2b', async (c) => {
  const { shop_id, items } = await c.req.json();
  if (!shop_id || !items?.length) return c.json({ error: '缺少必要字段' }, 400);

  const orderNo = 'B2B' + Date.now().toString(36).toUpperCase();
  let total = 0;

  // 计算总价 + 扣减库存
  for (const item of items) {
    const product = await c.env.DB.prepare('SELECT price FROM products WHERE id = ?').bind(item.product_id).first();
    if (!product) return c.json({ error: `商品 ${item.product_id} 不存在` }, 400);
    
    const subtotal = product.price * item.quantity;
    total += subtotal;

    // 更新库存
    if (item.batch_no) {
      await c.env.DB.prepare(
        'UPDATE inventory SET quantity = quantity + ? WHERE shop_id = ? AND product_id = ? AND batch_no = ?'
      ).bind(item.quantity, shop_id, item.product_id, item.batch_no).run();
    } else {
      await c.env.DB.prepare(
        'INSERT INTO inventory (shop_id, product_id, quantity, batch_no) VALUES (?, ?, ?, ?)'
      ).bind(shop_id, item.product_id, item.quantity, 'BATCH-' + Date.now().toString(36)).run();
    }
  }

  const order = await c.env.DB.prepare(
    'INSERT INTO orders (type, order_no, shop_id, total, status) VALUES (?, ?, ?, ?, ?) RETURNING id'
  ).bind('b2b', orderNo, shop_id, total, 'paid').first();

  // 写入订单明细
  for (const item of items) {
    await c.env.DB.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)'
    ).bind(order?.id, item.product_id, item.quantity, item.price || 0, total).run();
  }

  return c.json({ success: true, id: order?.id, order_no: orderNo });
});

// 创建 B2C 订单（消费者购买）
app.post('/api/orders/b2c', async (c) => {
  const { user_id, shop_id, items } = await c.req.json();
  if (!user_id || !items?.length) return c.json({ error: '缺少必要字段' }, 400);

  const orderNo = 'B2C' + Date.now().toString(36).toUpperCase();
  let total = 0;

  for (const item of items) {
    const product = await c.env.DB.prepare('SELECT price FROM products WHERE id = ?').bind(item.product_id).first();
    if (!product) return c.json({ error: `商品 ${item.product_id} 不存在` }, 400);
    total += product.price * item.quantity;
  }

  const order = await c.env.DB.prepare(
    'INSERT INTO orders (type, order_no, user_id, shop_id, total, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
  ).bind('b2c', orderNo, user_id, shop_id || null, total, 'pending').first();

  for (const item of items) {
    const product = await c.env.DB.prepare('SELECT price FROM products WHERE id = ?').bind(item.product_id).first();
    await c.env.DB.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)'
    ).bind(order?.id, item.product_id, item.quantity, product.price, product.price * item.quantity).run();
  }

  return c.json({ success: true, id: order?.id, order_no: orderNo, total });
});

// 订单列表
app.get('/api/orders', async (c) => {
  const { shop_id, user_id, status, page = '1', limit = '20' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let query = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];
  if (shop_id) { query += ' AND shop_id = ?'; params.push(shop_id); }
  if (user_id) { query += ' AND user_id = ?'; params.push(user_id); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const result = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ data: result.results, page: parseInt(page), limit: parseInt(limit) });
});

// 订单详情
app.get('/api/orders/:id', async (c) => {
  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(c.req.param('id')).first();
  if (!order) return c.json({ error: '订单不存在' }, 404);

  const items = await c.env.DB.prepare(
    'SELECT oi.*, p.name as product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?'
  ).bind(c.req.param('id')).all();

  return c.json({ ...order, items: items.results });
});

// 商品管理
app.get('/api/products', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM products WHERE status = ? ORDER BY created_at DESC'
  ).bind('active').all();
  return c.json({ data: result.results });
});

app.post('/api/products', async (c) => {
  const body = await c.req.json();
  const result = await c.env.DB.prepare(
    'INSERT INTO products (name, category, description, price, cost, shelf_life_days) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
  ).bind(body.name, body.category, body.description, body.price, body.cost, body.shelf_life_days || 365).first();
  return c.json({ success: true, id: result?.id });
});

export default app;

// ====== 购物车 ======

// 获取购物车
app.get('/api/cart/:user_id', async (c) => {
  const userId = c.req.param('user_id');
  let cart = await c.env.DB.prepare('SELECT id FROM cart WHERE user_id = ?').bind(userId).first() as any;
  
  if (!cart) {
    await c.env.DB.prepare('INSERT INTO cart (user_id) VALUES (?)').bind(userId).run();
    cart = await c.env.DB.prepare('SELECT id FROM cart WHERE user_id = ?').bind(userId).first() as any;
  }

  const items = await c.env.DB.prepare(
    `SELECT ci.*, p.name, p.price, p.image_url, p.description 
     FROM cart_items ci JOIN products p ON p.id = ci.product_id 
     WHERE ci.cart_id = ? ORDER BY ci.created_at DESC`
  ).bind(cart.id).all();

  const total = items.results.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return c.json({ cart_id: cart.id, items: items.results, total });
});

// 加入购物车
app.post('/api/cart/add', async (c) => {
  const { user_id, product_id, quantity = 1 } = await c.req.json();
  if (!user_id || !product_id) return c.json({ error: '缺少必要信息' }, 400);

  let cart = await c.env.DB.prepare('SELECT id FROM cart WHERE user_id = ?').bind(user_id).first() as any;
  if (!cart) {
    await c.env.DB.prepare('INSERT INTO cart (user_id) VALUES (?)').bind(user_id).run();
    cart = await c.env.DB.prepare('SELECT id FROM cart WHERE user_id = ?').bind(user_id).first() as any;
  }

  // 检查是否已有该商品
  const existing = await c.env.DB.prepare('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?')
    .bind(cart.id, product_id).first() as any;
  
  if (existing) {
    await c.env.DB.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?')
      .bind(quantity, existing.id).run();
  } else {
    await c.env.DB.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)')
      .bind(cart.id, product_id, quantity).run();
  }

  await c.env.DB.prepare('UPDATE cart SET updated_at = datetime(\'now\') WHERE id = ?').bind(cart.id).run();
  return c.json({ success: true });
});

// 更新购物车数量
app.put('/api/cart/item/:item_id', async (c) => {
  const { quantity } = await c.req.json();
  await c.env.DB.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?')
    .bind(quantity, c.req.param('item_id')).run();
  return c.json({ success: true });
});

// 删除购物车商品
app.delete('/api/cart/item/:item_id', async (c) => {
  await c.env.DB.prepare('DELETE FROM cart_items WHERE id = ?').bind(c.req.param('item_id')).run();
  return c.json({ success: true });
});

// 清空购物车
app.delete('/api/cart/:user_id', async (c) => {
  const cart = await c.env.DB.prepare('SELECT id FROM cart WHERE user_id = ?').bind(c.req.param('user_id')).first() as any;
  if (cart) {
    await c.env.DB.prepare('DELETE FROM cart_items WHERE cart_id = ?').bind(cart.id).run();
  }
  return c.json({ success: true });
});

// ====== 支付 ======

// 创建支付（微信支付模拟）
app.post('/api/payments/create', async (c) => {
  const { order_id, method = 'wechat' } = await c.req.json();
  if (!order_id) return c.json({ error: '缺少订单ID' }, 400);

  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(order_id).first() as any;
  if (!order) return c.json({ error: '订单不存在' }, 404);
  if (order.status !== 'pending') return c.json({ error: '订单状态异常' }, 400);

  // 微信支付统一下单（模拟返回 prepay_id）
  const prepayId = 'wx' + Date.now().toString(36).toUpperCase();

  // 生产环境需调用: POST https://api.weixin.qq.com/pay/unifiedorder
  // 需参数: appid, mch_id, nonce_str, sign, body, out_trade_no, total_fee, spbill_create_ip, notify_url, trade_type

  await c.env.DB.prepare("UPDATE orders SET status = 'paid', paid_at = datetime('now') WHERE id = ?").bind(order_id).run();

  return c.json({
    success: true,
    payment: {
      prepay_id: prepayId,
      nonce_str: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      timestamp: Math.floor(Date.now() / 1000).toString(),
      package: `prepay_id=${prepayId}`,
      sign_type: 'MD5',
      // 前端用以上参数调起 wx.requestPayment
    },
  });
});

// 支付回调通知
app.post('/api/payments/notify', async (c) => {
  const body = await c.req.text();
  // 验证微信签名...
  const orderId = 'extracted_from_xml'; // 解析 XML 获取
  await c.env.DB.prepare("UPDATE orders SET status='paid', paid_at=datetime('now') WHERE id=?").bind(orderId).run();
  return new Response('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>', {
    headers: { 'Content-Type': 'application/xml' },
  });
});

// 查询支付状态
app.get('/api/payments/status/:order_id', async (c) => {
  const order = await c.env.DB.prepare('SELECT status, paid_at FROM orders WHERE id=?')
    .bind(c.req.param('order_id')).first();
  return c.json(order || { error: '订单不存在' }, order ? 200 : 404);
});
