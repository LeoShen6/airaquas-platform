-- Airaquas 毛发健康平台 - D1 数据库 Schema
-- 运行: wrangler d1 execute airaquas-hair --file=shared/schema.sql

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  type TEXT NOT NULL CHECK(type IN ('brand','shop','staff','customer')),
  phone TEXT UNIQUE,
  wx_openid TEXT UNIQUE,
  password_hash TEXT,
  name TEXT,
  avatar_url TEXT,
  shop_id TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active','disabled')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_shop ON users(shop_id);

-- 门店表
CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  address TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','active','suspended')),
  profit_rate REAL DEFAULT 0.6,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  cost REAL,
  shelf_life_days INTEGER DEFAULT 365,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

-- 库存表
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  shop_id TEXT NOT NULL REFERENCES shops(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER DEFAULT 0,
  batch_no TEXT,
  expire_date TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(shop_id, product_id, batch_no)
);
CREATE INDEX IF NOT EXISTS idx_inventory_shop ON inventory(shop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expire ON inventory(expire_date);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  type TEXT NOT NULL CHECK(type IN ('b2b','b2c')),
  order_no TEXT UNIQUE,
  shop_id TEXT REFERENCES shops(id),
  user_id TEXT REFERENCES users(id),
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','paid','shipped','completed','cancelled')),
  created_at TEXT DEFAULT (datetime('now')),
  paid_at TEXT,
  completed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 订单明细表
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  subtotal REAL NOT NULL
);

-- AI 诊断记录表
CREATE TABLE IF NOT EXISTS diagnoses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  shop_id TEXT REFERENCES shops(id),
  score INTEGER,
  scalp_type TEXT,
  recommendation TEXT,
  report_url TEXT,
  questionnaire TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_diagnoses_user ON diagnoses(user_id);

-- 分润记录表
CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  order_id TEXT NOT NULL REFERENCES orders(id),
  shop_id TEXT REFERENCES shops(id),
  staff_id TEXT REFERENCES users(id),
  type TEXT CHECK(type IN ('signup','sale','bonus')),
  amount REAL NOT NULL,
  rate REAL,
  settled INTEGER DEFAULT 0,
  settled_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_commissions_shop ON commissions(shop_id);
CREATE INDEX IF NOT EXISTS idx_commissions_staff ON commissions(staff_id);

-- 营销素材表
CREATE TABLE IF NOT EXISTS marketing_assets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  type TEXT CHECK(type IN ('poster','copy','video','coupon')),
  content TEXT,
  image_url TEXT,
  tags TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS sys_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);
