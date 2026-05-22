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
  ).bind('b2c', orderNo, user_id, shop_id, total, 'pending').first();

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
