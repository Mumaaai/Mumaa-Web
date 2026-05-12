-- MUMAA Application Database Schema (SQLite)

-- 1. Users / Parents Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Babies Table
CREATE TABLE IF NOT EXISTS babies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. AI Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT CHECK( role IN ('user', 'assistant', 'system') ) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Activity Logs (Feeding, Diaper, Sleep)
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    baby_id TEXT NOT NULL,
    activity_type TEXT CHECK( activity_type IN ('feeding', 'diaper', 'sleep') ) NOT NULL,
    -- Details based on type: 
    -- Feeding: 'breast', 'bottle', 'solid'
    -- Diaper: 'wet', 'dirty', 'both'
    detail TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME, -- Mainly used for sleep duration
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- 5. Growth Tracker
CREATE TABLE IF NOT EXISTS growth_records (
    id TEXT PRIMARY KEY,
    baby_id TEXT NOT NULL,
    weight_kg REAL,
    height_cm REAL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- 6. Vaccinations
CREATE TABLE IF NOT EXISTS vaccinations (
    id TEXT PRIMARY KEY,
    baby_id TEXT NOT NULL,
    vaccine_name TEXT NOT NULL,
    due_date DATE NOT NULL,
    administered_date DATE,
    status TEXT CHECK( status IN ('pending', 'completed', 'missed') ) DEFAULT 'pending',
    notes TEXT,
    FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- 7. Milestones
CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    baby_id TEXT NOT NULL,
    milestone_name TEXT NOT NULL,
    category TEXT, -- e.g., 'motor', 'cognitive', 'social'
    achieved_date DATE,
    status TEXT CHECK( status IN ('pending', 'achieved') ) DEFAULT 'pending',
    FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- 8. Memory Journal
CREATE TABLE IF NOT EXISTS memory_journal (
    id TEXT PRIMARY KEY,
    baby_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT, -- For storing photos or videos (AWS S3/Local Path)
    recorded_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- 9. Dumamu Marketplace Products
CREATE TABLE IF NOT EXISTS dumamu_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK( category IN ('toy', 'care', 'accessory', 'feeding', 'safety') ) NOT NULL,
    price REAL NOT NULL,
    compare_price REAL,        -- Original price for showing discounts
    currency TEXT DEFAULT 'INR',
    image_url TEXT,
    age_range TEXT,             -- e.g., '0-6 months', '6-12 months'
    in_stock INTEGER DEFAULT 1,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    tags TEXT,                  -- Comma-separated tags
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Shopping Cart
CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES dumamu_products(id) ON DELETE CASCADE
);

-- 11. Orders (for future checkout flow)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    total_amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT CHECK( status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') ) DEFAULT 'pending',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES dumamu_products(id) ON DELETE CASCADE
);
