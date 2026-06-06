-- 安柯耳 Airaquas D1 数据库初始化
-- 创建时间: 2025-06-06
-- 适用: Cloudflare D1

-- 头皮检测记录表
CREATE TABLE IF NOT EXISTS detections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  user_id TEXT,
  image_key TEXT,
  score INTEGER,
  hair_type TEXT,
  dimensions TEXT,       -- JSON array: [{"label":"油脂分泌","key":"oil","score":70},...]
  findings TEXT,         -- JSON array of strings
  tips TEXT,             -- JSON array of strings
  products TEXT,         -- JSON array of objects
  confidence REAL DEFAULT 0.7,
  model_version TEXT DEFAULT 'v1.0',
  provider TEXT DEFAULT 'dashscope',  -- AI provider used: "dashscope" | "workers-ai" | "rule-engine"
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT DEFAULT (datetime('now', '+24 hours'))
);

CREATE INDEX IF NOT EXISTS idx_detections_session ON detections(session_id);
CREATE INDEX IF NOT EXISTS idx_detections_user ON detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_created ON detections(created_at DESC);

-- 用户表（邮箱报告订阅）
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE,
  email TEXT,
  nickname TEXT,
  session_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_active_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id);

-- 门店表（城市美发圈）
CREATE TABLE IF NOT EXISTS salons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  name TEXT,
  address TEXT,
  lat REAL,
  lng REAL,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);
