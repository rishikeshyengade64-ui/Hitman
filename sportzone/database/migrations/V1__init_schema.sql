-- ==========================================================
-- Flyway Migration: V1__init_schema.sql
-- Target Database: Microsoft SQL Server (MSSQL)
-- Project: SportZone E-Commerce Platform
-- ==========================================================

-- 1. Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(150) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(100) NOT NULL,
        role NVARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
        phone NVARCHAR(50) NULL,
        street_address NVARCHAR(255) NULL,
        apt_suite NVARCHAR(100) NULL,
        city NVARCHAR(100) NULL,
        state NVARCHAR(50) NULL,
        zip_code NVARCHAR(20) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_users_email ON users(email);
END;

-- 2. Categories Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(500) NULL,
        icon NVARCHAR(50) NULL,
        item_count INT NOT NULL DEFAULT 0,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_categories_slug ON categories(slug);
END;

-- 3. Products Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        slug NVARCHAR(255) NOT NULL UNIQUE,
        sku NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(MAX) NULL,
        price DECIMAL(10,2) NOT NULL,
        msrp DECIMAL(10,2) NULL,
        discount_percentage INT NOT NULL DEFAULT 0,
        brand NVARCHAR(100) NOT NULL DEFAULT 'Apex Athletic',
        category_id BIGINT NOT NULL,
        in_stock BIT NOT NULL DEFAULT 1,
        stock_quantity INT NOT NULL DEFAULT 100,
        rating DECIMAL(3,2) NOT NULL DEFAULT 4.90,
        review_count INT NOT NULL DEFAULT 0,
        is_featured BIT NOT NULL DEFAULT 0,
        is_new_arrival BIT NOT NULL DEFAULT 0,
        weight_grams INT NULL,
        midsole_tech NVARCHAR(100) NULL,
        propulsion_unit NVARCHAR(100) NULL,
        drop_height_mm DECIMAL(4,1) NULL,
        primary_image_url NVARCHAR(1000) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_products_category ON products(category_id);
    CREATE INDEX idx_products_brand ON products(brand);
    CREATE INDEX idx_products_price ON products(price);
    CREATE INDEX idx_products_is_featured ON products(is_featured);
END;

-- 4. Product Images Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_images')
BEGIN
    CREATE TABLE product_images (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        image_url NVARCHAR(1000) NOT NULL,
        angle_label NVARCHAR(50) NOT NULL,
        display_order INT NOT NULL DEFAULT 0,
        is_primary BIT NOT NULL DEFAULT 0,
        alt_text NVARCHAR(500) NULL,
        CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_product_images_product ON product_images(product_id);
END;

-- 5. Product Variants Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_variants')
BEGIN
    CREATE TABLE product_variants (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        size NVARCHAR(50) NOT NULL,
        color NVARCHAR(100) NOT NULL,
        stock_quantity INT NOT NULL DEFAULT 50,
        sku NVARCHAR(100) NULL,
        price_override DECIMAL(10,2) NULL,
        CONSTRAINT fk_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_product_variants_product ON product_variants(product_id);
END;

-- 6. Promo Codes Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'promo_codes')
BEGIN
    CREATE TABLE promo_codes (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(50) NOT NULL UNIQUE,
        discount_percent INT NOT NULL DEFAULT 0,
        discount_amount DECIMAL(10,2) NULL,
        min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        is_active BIT NOT NULL DEFAULT 1,
        expiry_date DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
    CREATE INDEX idx_promo_codes_code ON promo_codes(code);
END;

-- 7. Cart Items Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cart_items')
BEGIN
    CREATE TABLE cart_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        variant_id BIGINT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_cart_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id),
        CONSTRAINT fk_cart_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    );
    CREATE INDEX idx_cart_items_user ON cart_items(user_id);
END;

-- 8. Orders Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE orders (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        order_number NVARCHAR(50) NOT NULL UNIQUE,
        user_id BIGINT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        promo_code NVARCHAR(50) NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
        payment_method NVARCHAR(50) NOT NULL DEFAULT 'CREDIT_CARD',
        payment_status NVARCHAR(50) NOT NULL DEFAULT 'PAID',
        shipping_first_name NVARCHAR(100) NOT NULL,
        shipping_last_name NVARCHAR(100) NOT NULL,
        shipping_address NVARCHAR(255) NOT NULL,
        shipping_apt NVARCHAR(100) NULL,
        shipping_city NVARCHAR(100) NOT NULL,
        shipping_state NVARCHAR(50) NOT NULL,
        shipping_zip_code NVARCHAR(20) NOT NULL,
        shipping_phone NVARCHAR(50) NOT NULL,
        shipping_tier NVARCHAR(50) NOT NULL DEFAULT 'EXPRESS_STANDARD',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX idx_orders_user ON orders(user_id);
    CREATE INDEX idx_orders_number ON orders(order_number);
END;

-- 9. Order Items Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE order_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        order_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        product_title NVARCHAR(255) NOT NULL,
        variant_size NVARCHAR(50) NULL,
        variant_color NVARCHAR(100) NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        image_url NVARCHAR(1000) NULL,
        CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
    );
    CREATE INDEX idx_order_items_order ON order_items(order_id);
END;

-- 10. Reviews Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reviews')
BEGIN
    CREATE TABLE reviews (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title NVARCHAR(200) NOT NULL,
        comment NVARCHAR(MAX) NOT NULL,
        verified_purchase BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX idx_reviews_product ON reviews(product_id);
END;
