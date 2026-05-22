-- Airaquas Hair Health Platform - Database Schema
-- D1 Database: airaquas-hair

-- ============== SYSTEM TABLES ==============

CREATE TABLE IF NOT EXISTS sys_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============== USER TABLES ==============

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'staff',
  shop_id TEXT,
  real_name TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS weapp_users (
  id TEXT PRIMARY KEY,
  openid TEXT UNIQUE,
  user_id TEXT,
  nickname TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============== PRODUCT TABLES ==============

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  cost REAL,
  shelf_life_days INTEGER DEFAULT 365,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_tags (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  product_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============== ORDER TABLES ==============

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  weapp_user_id TEXT,
  shop_id TEXT,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============== CART TABLES ==============

CREATE TABLE IF NOT EXISTS cart (
  id TEXT PRIMARY KEY,
  weapp_user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (weapp_user_id) REFERENCES weapp_users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  cart_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL,
  FOREIGN KEY (cart_id) REFERENCES cart(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============== INVENTORY ==============

CREATE TABLE IF NOT EXISTS inventory (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  product_id TEXT NOT NULL,
  shop_id TEXT,
  quantity INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- ============== DIAGNOSIS ==============

CREATE TABLE IF NOT EXISTS diagnoses (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  weapp_user_id TEXT,
  diagnosis_type TEXT DEFAULT 'ai',
  scalp_type TEXT,
  score INTEGER,
  diagnosis TEXT,
  advice TEXT,
  product_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============== MARKETING ==============

CREATE TABLE IF NOT EXISTS marketing_assets (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  product_id TEXT NOT NULL,
  title TEXT,
  content TEXT,
  asset_type TEXT DEFAULT 'image',
  url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============== PROFIT / COMMISSION ==============

CREATE TABLE IF NOT EXISTS commissions (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  product_id TEXT NOT NULL,
  commission_type TEXT DEFAULT 'fixed',
  amount REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============== COMMUNITY ==============

CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  weapp_user_id TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  images TEXT,
  type TEXT DEFAULT 'post',
  status TEXT DEFAULT 'published',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (weapp_user_id) REFERENCES weapp_users(id)
);

CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  post_id TEXT NOT NULL,
  weapp_user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (weapp_user_id) REFERENCES weapp_users(id)
);

CREATE TABLE IF NOT EXISTS community_likes (
  id TEXT DEFAULT (lower(hex(randomblob(16)))),
  post_id TEXT NOT NULL,
  weapp_user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (weapp_user_id) REFERENCES weapp_users(id)
);

-- ============== SEED DATA ==============

INSERT OR IGNORE INTO products (id, name, category, description, price, image_url, status) VALUES
('prod-probiotic-shampoo', '益生菌洗发水', 'shampoo', '含益生菌成分，温和清洁头皮，平衡微生态，适合日常使用。', 128, 'https://airaquas-api-assets.jfh-099.workers.dev/products/prod-probiotic-shampoo.svg', 'active'),
('prod-probiotic-conditioner', '益生菌护发乳', 'conditioner', '益生菌护发配方，修护发丝毛鳞片，使头发柔顺有光泽。', 128, 'https://airaquas-api-assets.jfh-099.workers.dev/products/prod-probiotic-conditioner.svg', 'active'),
('prod-scalp-spray', '头皮喷雾', 'spray', '清爽喷雾质地，直接作用于头皮，舒缓调理头皮环境。', 98, 'https://airaquas-api-assets.jfh-099.workers.dev/products/prod-scalp-spray.svg', 'active'),
('prod-aa-cleanser', '氨基酸洗面奶', 'cleanser', '氨基酸温和配方，深层清洁不紧绷，适合各种肤质。', 108, 'https://airaquas-api-assets.jfh-099.workers.dev/products/prod-aa-cleanser.svg', 'active');

INSERT OR IGNORE INTO product_tags (product_id, tag) VALUES
('prod-probiotic-shampoo', '益生菌'), ('prod-probiotic-shampoo', '清洁头皮'), ('prod-probiotic-shampoo', '油性头皮'),
('prod-probiotic-conditioner', '益生菌'), ('prod-probiotic-conditioner', '护发'), ('prod-probiotic-conditioner', '修护'),
('prod-scalp-spray', '头皮护理'), ('prod-scalp-spray', '清爽'), ('prod-scalp-spray', '舒缓'),
('prod-aa-cleanser', '氨基酸'), ('prod-aa-cleanser', '温和清洁'), ('prod-aa-cleanser', '洗面奶');
