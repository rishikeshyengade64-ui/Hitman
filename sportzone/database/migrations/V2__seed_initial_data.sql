-- ==========================================================
-- Flyway Migration: V2__seed_initial_data.sql
-- Target Database: Microsoft SQL Server (MSSQL)
-- Project: SportZone E-Commerce Platform
-- ==========================================================

-- 1. Insert Demo User (Password: Password123!)
-- BCrypt hash: $2a$10$Dow1m4qI7hLqV4zHk6kE6OaMskK74tAfxp1pYwU2y32gHh86e68oW
IF NOT EXISTS (SELECT * FROM users WHERE email = 'alex.mercer@sportzone.com')
BEGIN
    INSERT INTO users (email, password, full_name, role, phone, street_address, apt_suite, city, state, zip_code)
    VALUES (
        'alex.mercer@sportzone.com',
        '$2a$10$Dow1m4qI7hLqV4zHk6kE6OaMskK74tAfxp1pYwU2y32gHh86e68oW',
        'Alex Mercer',
        'ROLE_USER',
        '+1 (555) 019-2834',
        '742 Evergreen Velocity Way',
        'Suite 4B, Training Facility',
        'Seattle',
        'WA',
        '98101'
    );
END;

-- 2. Insert Categories
IF NOT EXISTS (SELECT * FROM categories WHERE slug = 'running')
BEGIN
    INSERT INTO categories (name, slug, description, icon, item_count) VALUES
    ('Running', 'running', 'High-performance marathon, sprint, and trail running footwear and apparel.', 'directions_run', 342),
    ('Football', 'football', 'Pro match balls, aerodynamic cleat gear, and team apparel.', 'sports_soccer', 218),
    ('Cricket', 'cricket', 'Tournament-spec English willow bats, protective gear, and footwear.', 'sports_cricket', 164),
    ('Basketball', 'basketball', 'High-traction court shoes, jerseys, and responsive indoor/outdoor basketballs.', 'sports_basketball', 129),
    ('Tennis', 'tennis', 'Aerodynamic carbon fiber racquets, court footwear, and moisture-wicking apparel.', 'sports_tennis', 108),
    ('Badminton', 'badminton', 'Tournament graphite rackets, aero feather shuttlecocks, and court gear.', 'sports_tennis', 145),
    ('Gym & Fitness', 'gym-fitness', 'Strength training accessories, compression wear, and hydration tech.', 'fitness_center', 195),
    ('Cycling', 'cycling', 'Aerodynamic cycling helmets, speed bibs, and carbon fiber road accessories.', 'pedal_bike', 92);
END;

-- 3. Insert Products
DECLARE @runningId BIGINT = (SELECT id FROM categories WHERE slug = 'running');
DECLARE @footballId BIGINT = (SELECT id FROM categories WHERE slug = 'football');
DECLARE @cricketId BIGINT = (SELECT id FROM categories WHERE slug = 'cricket');
DECLARE @basketballId BIGINT = (SELECT id FROM categories WHERE slug = 'basketball');
DECLARE @tennisId BIGINT = (SELECT id FROM categories WHERE slug = 'tennis');
DECLARE @badmintonId BIGINT = (SELECT id FROM categories WHERE slug = 'badminton');
DECLARE @gymId BIGINT = (SELECT id FROM categories WHERE slug = 'gym-fitness');

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-CV-88219')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, midsole_tech, propulsion_unit, drop_height_mm, primary_image_url
    ) VALUES (
        'CarbonVolt Strider Road Racing Shoes',
        'carbonvolt-strider-road-racing-shoes',
        'SZ-CV-88219',
        'Engineered for elite marathoners and road racers seeking maximum velocity and explosive energy return. Features a full-length 3K curved carbon fiber propulsion plate sandwiched between twin layers of ultra-resilient AeroFoam+ cushioning.',
        199.99,
        220.00,
        9,
        'Apex Athletic',
        @runningId,
        1,
        85,
        4.95,
        142,
        1,
        1,
        215,
        'AeroFoam+ Max',
        '100% 3K Carbon',
        8.0,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-FB-55420')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Pro Match Thermal Bonded Football Size 5',
        'pro-match-thermal-bonded-football-size-5',
        'SZ-FB-55420',
        'Official tournament match ball engineered with seamless thermal bonding technology for optimal flight stability, zero water absorption, and responsive touch. FIFA Quality Pro certified.',
        79.99,
        99.99,
        20,
        'Apex Athletic',
        @footballId,
        1,
        120,
        4.88,
        94,
        1,
        0,
        430,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwRzCkqve6Jvrm4Jkc8I6sbS3E_QVSf_poeGCB3l9-SvTmf2D0OBpwa9BpVt24Fjs34X4xCUeN5uQZiUVekuAn-8hAeObk9Z3jwE-T_8MNSVuSfkH3WHEVsfmV2m3C0OpXMnwcmH5nZVb5WxvE6LB0iQs96X4Dp0EcK7HD_rlcH6S9AHcswwbTDlvYuGjnxefIZLjfosuc984-3o22GcEKULu4z6-0qJ8Ku8ojQmv7eAuNF2uziY9'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-CR-99101')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Apex Pro Elite Carbon Cricket Bat',
        'apex-pro-elite-carbon-cricket-bat',
        'SZ-CR-99101',
        'Handcrafted from Grade 1+ English Willow with reinforced carbon-infused cane handle for exceptional power transfer, enormous 40mm contoured edges, and featherlight pickup.',
        289.99,
        320.00,
        10,
        'Apex Athletic',
        @cricketId,
        1,
        40,
        4.92,
        68,
        1,
        1,
        1180,
        'https://lh3.googleusercontent.com/aida/AEtjO1U1O0QJq0k7J-D3PAeMH_ig1t4sP4XufEo0m_25P1vpN3i1znnB9CFWCfbu2zt1u8ThXNVNoypoJFqWAqYK6-nBZe-_WRRsbafrKfbiOvlLKYw5SF4MDxQWNAclH7f4qwgo3qarSx-it4zTX5LsZ9JRODii8j5BsAyskKuM1a6OOT-WTWkysYH7wtmWukc-e5wlbimcKYeyB8gBbdwaXDf7qOhODbFSN7j8PC0LdwdD0_cdAZ8RdUxwplg'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-BB-33201')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'CourtVelocity HyperGrip Basketball Shoes',
        'courtvelocity-hypergrip-basketball-shoes',
        'SZ-BB-33201',
        'Explosive hardwood agility with multi-directional herringbone traction and adaptive ankle lockdown harness for lightning-fast crossovers and impact protection.',
        159.99,
        180.00,
        11,
        'Apex Athletic',
        @basketballId,
        1,
        65,
        4.84,
        81,
        1,
        0,
        380,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDdN4TwH3ZN4LFzRVxJt2v6JZvc9jWnbiIPvCI8BZ1eFBA61zg8QKa4csYdekFc95WzkMj7SdFhDRdYnRBih3eMwYPXUh6AupdrGxQD9-aINGiR2T80GPhVb_aSvGCgHGa89R6muY-bxE0UngYZnHS1e27eN_F66mfAE31CY_P9uOPA-Szk8qanUbtwiCmjmwSzmiU9n07Ay6CZLb7TN4rLrUPh0dXG_bZE8Ldh7u92D9Zy3jbFewPq'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-TN-44102')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Aeroflex Court Pro 98 Tennis Racket',
        'aeroflex-court-pro-98-tennis-racket',
        'SZ-TN-44102',
        'Precision tournament racquet featuring a 98 sq inch head, 16x19 spin string pattern, and high-modulus graphite framework delivering laser-targeted shot control and heavy topspin.',
        219.99,
        249.99,
        12,
        'Apex Athletic',
        @tennisId,
        1,
        50,
        4.90,
        53,
        0,
        1,
        305,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbx1R6cWtQINCkizgrUTpUs6PBPK7vuYRQus0qu_3b_tkQOIYbukJ_0S9RLgS8O6-z26X8_4QEmML9RxgnMjm58rFFwL9yE4xseFqLvNCazViClmbBmtvIZRzbSrK1lY0CVWbI3VAe0JjjrKSpkrNQc9_HyrojbOPnX3rYlqNoqbxfeQ1gA6IJCxusuoP8fJVp19B592l3dChjRKL2W1jhHgfD1oqeU7Mpwu6KvOfA1_cAggNNWVQ'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-AP-11002')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Kinetic Velocity 2-in-1 Compression Shorts',
        'kinetic-velocity-2-in-1-compression-shorts',
        'SZ-AP-11002',
        'Ultra-breathable 4-way stretch shorts with integrated moisture-wicking compression liner, zipper security pockets, and reflective volt accents for peak athletic output.',
        49.99,
        60.00,
        17,
        'Apex Athletic',
        @gymId,
        1,
        150,
        4.79,
        110,
        0,
        0,
        160,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTthylbmgq7TeXam-LqdYujXC8yXBMgp_I3TMRseslcs3uj1S7yJ_JA0iEkQfXWGeiH_JBWnXkN80PnQx-SSC9oqIe0LWE-nVCxa7qR8-GBZTdAPlkU0fgkmm7YaB4tUZWZAa-w3-1vCqW2a3Mx07yBw3m-zxFsKDUJ5FLuSQjD0pMwmy-JG14o_ukflaxo6BbBQphjoEAEUdE29wZuQBu3UIjg2Sk_iKq3MyYxTTfY6FxEeDbORR'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-CR-99205')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Apex Red Crown 4-Piece Leather Match Cricket Ball',
        'apex-red-crown-leather-match-cricket-ball',
        'SZ-CR-99205',
        'Hand-stitched Portuguese cork core encased in grade-A alum-tanned steer hide. 80-stitching seam delivers pronounced swing in humid conditions and prolonged durability over 80+ overs.',
        34.99,
        45.00,
        22,
        'Apex Athletic',
        @cricketId,
        1,
        120,
        4.94,
        64,
        0,
        1,
        156,
        'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=800&q=80'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-BM-77101')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Apex VoltStrike Carbon 900 Pro Badminton Racket',
        'apex-voltstrike-carbon-900-pro-badminton-racket',
        'SZ-BM-77101',
        'Engineered with high-modulus Japanese Toray HM graphite and an ultra-thin 6.6mm aero-dynamic shaft. Pre-strung at 28 lbs tension with high-elasticity braided nanotech string.',
        149.99,
        180.00,
        17,
        'Apex Athletic',
        @badmintonId,
        1,
        45,
        4.96,
        78,
        1,
        1,
        83,
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-BM-77202')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Apex AeroFlight Feather Shuttlecocks (Tube of 12)',
        'apex-aeroflight-feather-shuttlecocks-12',
        'SZ-BM-77202',
        'BWF approved tournament speed 77 goose feather shuttlecocks. Crafted from selected grade-A straight feathers with premium composite natural cork base for consistent flight trajectory.',
        29.99,
        36.00,
        17,
        'Apex Athletic',
        @badmintonId,
        1,
        85,
        4.91,
        112,
        0,
        1,
        60,
        'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-BB-33405')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Apex GripForce Official Game Basketball Size 7',
        'apex-gripforce-official-game-basketball-size-7',
        'SZ-BB-33405',
        'FIBA regulation size 7 indoor/outdoor composite leather basketball with deep-channel design for tactile grip, moisture-absorbing composite surface, and rotational balance core.',
        59.99,
        75.00,
        20,
        'Apex Athletic',
        @basketballId,
        1,
        90,
        4.89,
        95,
        0,
        1,
        620,
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'
    );
END;

IF NOT EXISTS (SELECT * FROM products WHERE sku = 'SZ-TN-44208')
BEGIN
    INSERT INTO products (
        title, slug, sku, description, price, msrp, discount_percentage, brand, category_id,
        in_stock, stock_quantity, rating, review_count, is_featured, is_new_arrival,
        weight_grams, primary_image_url
    ) VALUES (
        'Tour Championship Extra Duty Felt Tennis Balls (Can of 3)',
        'tour-championship-extra-duty-tennis-balls',
        'SZ-TN-44208',
        'ITF & USTA certified tournament pressurized tennis balls. Extra-duty woven interlocking felt resists fuzzing on hard court surfaces while the premium rubber core maintains lively bounce.',
        18.99,
        24.99,
        24,
        'Apex Athletic',
        @tennisId,
        1,
        150,
        4.88,
        71,
        0,
        1,
        175,
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'
    );
END;

-- 4. Insert Multi-Angle Gallery Images for CarbonVolt Strider
DECLARE @carbonVoltId BIGINT = (SELECT id FROM products WHERE sku = 'SZ-CV-88219');

IF NOT EXISTS (SELECT * FROM product_images WHERE product_id = @carbonVoltId)
BEGIN
    INSERT INTO product_images (product_id, image_url, angle_label, display_order, is_primary, alt_text) VALUES
    (@carbonVoltId, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L', 'Lateral', 1, 1, 'Lateral profile view with volt carbon plate visible'),
    (@carbonVoltId, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaqi-yAQlSfg6TLXnEBvTl_iv8IZDQgtEbtbghzsCWEzcsH7nffgTPakQmPxKQHaVTVEB0Xiah0S5NSoayRKDC6yHh8jxkoDe9gFpFVzJiwSphj_825to1Pt_-FAUBF-w0ogS6MdTH4uF8v4xWis4cEFsOOXS_DCwQdH-Rj7tL-jyi-_3EIUI6qJjgsVKZJPGKfZy9r0iCmZw6CKKYKlyEzFoWSMSCswk2IYAupzMjWTL-2b6Fvt7_', 'Medial', 2, 0, 'Medial interior arch view showcasing arch lockdown support'),
    (@carbonVoltId, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_ez5fMBgxDxnyNudMrAUkz-WVl75AV7uZyx0qm6Ty7hoUbRAJc07ZmmizKXODdcxCrUyGu3veaWoMXtwZkeYk9el81ICMj0zbOOB6WakDr-RkLGGGN25cuIru333YxN-f3FaNBeA01qjbDn-yhHekuRUe7iIMzHOMIcAp2Ym7gdn74ND2o0MWfcdnhaonQdufbLNlAmy6_vJiRUXyt6ZOIzWEgzdQiyapLhGiQBHptNcyj7tNRna', 'Toe-Box', 3, 0, 'Top-down aerial view of breathable mesh lattice'),
    (@carbonVoltId, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zr3x9IGi1KIfQuKfi5JqURbZGho_mKtFI4ZM8hdUlBJQ-CFseKPRklCMH0ED2yZkCF-t3VcJVsGETzZkzGXoR-QTcCtkiu7kgGL9r6an-__MXIMCa9N2dpsiWcjPnx3Pj7_4lipW9_E50M9t67_fIaFDJi6hDNmQQkmx9_WHYa3BQX8puKQmaCfsxhvDiuwTIhMAAztp5yJzFBRD1uhF3iu1Io9hrb4kcH8c5XINl60O0b3TdjC3', 'Carbon Outsole', 4, 0, 'Underside view displaying rigid woven carbon propulsion plate'),
    (@carbonVoltId, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbx1R6cWtQINCkizgrUTpUs6PBPK7vuYRQus0qu_3b_tkQOIYbukJ_0S9RLgS8O6-z26X8_4QEmML9RxgnMjm58rFFwL9yE4xseFqLvNCazViClmbBmtvIZRzbSrK1lY0CVWbI3VAe0JjjrKSpkrNQc9_HyrojbOPnX3rYlqNoqbxfeQ1gA6IJCxusuoP8fJVp19B592l3dChjRKL2W1jhHgfD1oqeU7Mpwu6KvOfA1_cAggNNWVQ', 'In Motion', 5, 0, 'Dynamic action athlete foot strike on athletics track');
END;

-- 5. Insert Product Variants (Sizes & Colors)
IF NOT EXISTS (SELECT * FROM product_variants WHERE product_id = @carbonVoltId)
BEGIN
    INSERT INTO product_variants (product_id, size, color, stock_quantity, sku) VALUES
    (@carbonVoltId, '7', 'Volt Neon / Obsidian', 15, 'SZ-CV-88219-07'),
    (@carbonVoltId, '7.5', 'Volt Neon / Obsidian', 12, 'SZ-CV-88219-075'),
    (@carbonVoltId, '8', 'Volt Neon / Obsidian', 20, 'SZ-CV-88219-08'),
    (@carbonVoltId, '8.5', 'Volt Neon / Obsidian', 18, 'SZ-CV-88219-085'),
    (@carbonVoltId, '9', 'Volt Neon / Obsidian', 25, 'SZ-CV-88219-09'),
    (@carbonVoltId, '9.5', 'Volt Neon / Obsidian', 14, 'SZ-CV-88219-095'),
    (@carbonVoltId, '10', 'Volt Neon / Obsidian', 10, 'SZ-CV-88219-10'),
    (@carbonVoltId, '11', 'Volt Neon / Obsidian', 8, 'SZ-CV-88219-11');
END;

-- 6. Insert Promo Codes
IF NOT EXISTS (SELECT * FROM promo_codes WHERE code = 'SPORT20')
BEGIN
    INSERT INTO promo_codes (code, discount_percent, min_order_amount, is_active)
    VALUES ('SPORT20', 20, 50.00, 1);
END;

IF NOT EXISTS (SELECT * FROM promo_codes WHERE code = 'CHAMPION10')
BEGIN
    INSERT INTO promo_codes (code, discount_percent, min_order_amount, is_active)
    VALUES ('CHAMPION10', 10, 0.00, 1);
END;
