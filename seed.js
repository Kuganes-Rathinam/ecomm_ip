// ============================================================
//  EBS E-Commerce — MongoDB Seed Script
//  Run with:  mongosh ecommerce seed.js
//  Or paste block-by-block into MongoDB Compass Shell
// ============================================================

// ---------- CLEAR EXISTING DATA ----------
db.categories.deleteMany({});
db.attributes.deleteMany({});
db.terms.deleteMany({});
db.products.deleteMany({});
print("✓ Cleared existing catalog data");

// ============================================================
// 1. CATEGORIES  (access via insertedIds[0], [1], ...)
// ============================================================
var catResult = db.categories.insertMany([
  { category_name: "Electronics"      },   // [0]
  { category_name: "Clothing"         },   // [1]
  { category_name: "Books"            },   // [2]
  { category_name: "Home & Kitchen"   },   // [3]
  { category_name: "Sports & Fitness" },   // [4]
  { category_name: "Beauty & Health"  },   // [5]
  { category_name: "Toys & Games"     },   // [6]
]);

var catElectronics = catResult.insertedIds[0].toString();
var catClothing    = catResult.insertedIds[1].toString();
var catBooks       = catResult.insertedIds[2].toString();
var catHome        = catResult.insertedIds[3].toString();
var catSports      = catResult.insertedIds[4].toString();
var catBeauty      = catResult.insertedIds[5].toString();
var catToys        = catResult.insertedIds[6].toString();

print("✓ Inserted 7 categories");

// ============================================================
// 2. ATTRIBUTES
// ============================================================
var attrResult = db.attributes.insertMany([
  { attribute_name: "Color",   slug: "color"   },   // [0]
  { attribute_name: "Size",    slug: "size"    },   // [1]
  { attribute_name: "Storage", slug: "storage" },   // [2]
  { attribute_name: "RAM",     slug: "ram"     },   // [3]
]);

var attrColor   = attrResult.insertedIds[0].toString();
var attrSize    = attrResult.insertedIds[1].toString();
var attrStorage = attrResult.insertedIds[2].toString();
var attrRAM     = attrResult.insertedIds[3].toString();

print("✓ Inserted 4 attributes");

// ============================================================
// 3. TERMS
// ============================================================
db.terms.insertMany([
  // --- Color ---
  { term_name: "Black",  slug: "black",    attribute_id: attrColor,   price: null  },
  { term_name: "White",  slug: "white",    attribute_id: attrColor,   price: null  },
  { term_name: "Blue",   slug: "blue",     attribute_id: attrColor,   price: null  },
  { term_name: "Red",    slug: "red",      attribute_id: attrColor,   price: null  },
  { term_name: "Green",  slug: "green",    attribute_id: attrColor,   price: null  },
  { term_name: "Grey",   slug: "grey",     attribute_id: attrColor,   price: null  },
  // --- Size ---
  { term_name: "XS",     slug: "xs",       attribute_id: attrSize,    price: null  },
  { term_name: "S",      slug: "s",        attribute_id: attrSize,    price: null  },
  { term_name: "M",      slug: "m",        attribute_id: attrSize,    price: null  },
  { term_name: "L",      slug: "l",        attribute_id: attrSize,    price: 50    },
  { term_name: "XL",     slug: "xl",       attribute_id: attrSize,    price: 100   },
  { term_name: "XXL",    slug: "xxl",      attribute_id: attrSize,    price: 150   },
  // --- Storage ---
  { term_name: "64 GB",  slug: "64gb",     attribute_id: attrStorage, price: null  },
  { term_name: "128 GB", slug: "128gb",    attribute_id: attrStorage, price: 500   },
  { term_name: "256 GB", slug: "256gb",    attribute_id: attrStorage, price: 1200  },
  { term_name: "512 GB", slug: "512gb",    attribute_id: attrStorage, price: 2500  },
  // --- RAM ---
  { term_name: "4 GB",   slug: "4gb-ram",  attribute_id: attrRAM,     price: null  },
  { term_name: "8 GB",   slug: "8gb-ram",  attribute_id: attrRAM,     price: 800   },
  { term_name: "16 GB",  slug: "16gb-ram", attribute_id: attrRAM,     price: 2000  },
]);

print("✓ Inserted 19 terms");

// ============================================================
// 4. PRODUCTS  (30 products, 7 categories, real Unsplash URLs)
// ============================================================
db.products.insertMany([

  // ── ELECTRONICS (10) ─────────────────────────────────────
  {
    category_id:    catElectronics,
    product_name:   "Apple iPhone 15 Pro",
    slug:           "apple-iphone-15-pro",
    description:    "Titanium design, A17 Pro chip, 48 MP main camera, 5× telephoto optical zoom. The most advanced iPhone ever built.",
    product_type:   "Smartphone",
    original_price: 134900,
    sale_price:     124999,
    quantity:       42,
    ratings:        4.8,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Samsung Galaxy S24 Ultra",
    slug:           "samsung-galaxy-s24-ultra",
    description:    "200 MP camera, built-in S Pen, Snapdragon 8 Gen 3. The ultimate Android flagship with Galaxy AI features.",
    product_type:   "Smartphone",
    original_price: 129999,
    sale_price:     114999,
    quantity:       35,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1707237639736-d41ba34e2f32?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Sony WH-1000XM5 Headphones",
    slug:           "sony-wh1000xm5-headphones",
    description:    "Industry-leading noise cancellation, Dual Noise Sensor Technology, 30-hour battery life, multipoint connection.",
    product_type:   "Audio",
    original_price: 29990,
    sale_price:     24990,
    quantity:       120,
    ratings:        4.9,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Apple MacBook Air M3",
    slug:           "apple-macbook-air-m3",
    description:    "15.3-inch Liquid Retina display, M3 chip, 18-hour battery, 8 GB unified memory. Impossibly thin laptop.",
    product_type:   "Laptop",
    original_price: 134900,
    sale_price:     null,
    quantity:       28,
    ratings:        4.8,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "iPad Pro 12.9-inch M4",
    slug:           "ipad-pro-12-9-m4",
    description:    "Ultra Retina XDR display, M4 chip, Apple Pencil Pro compatible. Just 5.1 mm thin — the thinnest Apple product ever.",
    product_type:   "Tablet",
    original_price: 112900,
    sale_price:     104999,
    quantity:       55,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Logitech MX Master 3S Mouse",
    slug:           "logitech-mx-master-3s",
    description:    "8 000 DPI Darkfield sensor, Ultra-fast MagSpeed scroll, ergonomic form. Works on any surface including glass.",
    product_type:   "Accessories",
    original_price: 9995,
    sale_price:     7995,
    quantity:       200,
    ratings:        4.8,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Dell 27-inch 4K Monitor",
    slug:           "dell-27-4k-monitor",
    description:    "27-inch IPS 4K UHD display, 99 % sRGB, USB-C 90 W charging. Perfect for creative professionals.",
    product_type:   "Monitor",
    original_price: 54990,
    sale_price:     46990,
    quantity:       18,
    ratings:        4.6,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "GoPro HERO 12 Black",
    slug:           "gopro-hero-12-black",
    description:    "5.3 K60 video, HyperSmooth 6.0 stabilisation, waterproof to 10 m, HDR video and photo support.",
    product_type:   "Camera",
    original_price: 41000,
    sale_price:     35990,
    quantity:       65,
    ratings:        4.6,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Amazon Echo Dot 5th Gen",
    slug:           "amazon-echo-dot-5th-gen",
    description:    "Smart speaker with Alexa — bigger sound, built-in temperature sensor, motion detection, and eero built-in.",
    product_type:   "Smart Home",
    original_price: 5499,
    sale_price:     2999,
    quantity:       500,
    ratings:        4.4,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&q=80",
  },
  {
    category_id:    catElectronics,
    product_name:   "Kindle Paperwhite 11th Gen",
    slug:           "kindle-paperwhite-11th-gen",
    description:    "6.8-inch display with adjustable warm light, waterproof, 10-week battery life. Ad-free, with 8 GB storage.",
    product_type:   "E-Reader",
    original_price: 14999,
    sale_price:     12999,
    quantity:       90,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
  },

  // ── CLOTHING (6) ─────────────────────────────────────────
  {
    category_id:    catClothing,
    product_name:   "Men's Classic Oxford Shirt",
    slug:           "mens-classic-oxford-shirt",
    description:    "100 % premium cotton Oxford weave, button-down collar, tailored fit. Perfect for work or the weekend.",
    product_type:   "Shirt",
    original_price: 2499,
    sale_price:     1799,
    quantity:       300,
    ratings:        4.3,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
  },
  {
    category_id:    catClothing,
    product_name:   "Women's Floral Midi Dress",
    slug:           "womens-floral-midi-dress",
    description:    "Lightweight chiffon with vibrant floral print. V-neck, flared midi skirt, adjustable tie waist.",
    product_type:   "Dress",
    original_price: 3299,
    sale_price:     2199,
    quantity:       180,
    ratings:        4.5,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
  },
  {
    category_id:    catClothing,
    product_name:   "Unisex Slim Fit Chinos",
    slug:           "unisex-slim-fit-chinos",
    description:    "Stretch twill fabric, slim fit through hip and thigh. Machine washable, wrinkle-resistant.",
    product_type:   "Pants",
    original_price: 2999,
    sale_price:     1999,
    quantity:       250,
    ratings:        4.4,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  },
  {
    category_id:    catClothing,
    product_name:   "Premium Wool Blend Overcoat",
    slug:           "premium-wool-blend-overcoat",
    description:    "70 % wool, 30 % polyester. Double-breasted front, notched lapel, fully lined. A wardrobe staple.",
    product_type:   "Outerwear",
    original_price: 9999,
    sale_price:     7499,
    quantity:       75,
    ratings:        4.6,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=600&q=80",
  },
  {
    category_id:    catClothing,
    product_name:   "Nike Air Max 270",
    slug:           "nike-air-max-270",
    description:    "Max Air unit in the heel delivers all-day comfort. Lightweight mesh upper, foam midsole.",
    product_type:   "Footwear",
    original_price: 13495,
    sale_price:     10995,
    quantity:       130,
    ratings:        4.5,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    category_id:    catClothing,
    product_name:   "Pure Cashmere Crewneck Sweater",
    slug:           "pure-cashmere-crewneck-sweater",
    description:    "Grade A cashmere, ultra-soft hand feel, ribbed cuffs and hem. Lightweight yet incredibly warm.",
    product_type:   "Knitwear",
    original_price: 7999,
    sale_price:     null,
    quantity:       60,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
  },

  // ── BOOKS (4) ────────────────────────────────────────────
  {
    category_id:    catBooks,
    product_name:   "Atomic Habits — James Clear",
    slug:           "atomic-habits-james-clear",
    description:    "Tiny changes, remarkable results. World's #1 bestseller on building good habits and breaking bad ones.",
    product_type:   "Self-Help",
    original_price: 799,
    sale_price:     499,
    quantity:       1000,
    ratings:        4.9,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=600&q=80",
  },
  {
    category_id:    catBooks,
    product_name:   "The Psychology of Money",
    slug:           "the-psychology-of-money",
    description:    "Timeless lessons on wealth, greed, and happiness by Morgan Housel. A must-read for every investor.",
    product_type:   "Finance",
    original_price: 699,
    sale_price:     399,
    quantity:       800,
    ratings:        4.8,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  },
  {
    category_id:    catBooks,
    product_name:   "Deep Work — Cal Newport",
    slug:           "deep-work-cal-newport",
    description:    "Rules for focused success in a distracted world. Cal Newport argues that deep focus is the new competitive advantage.",
    product_type:   "Productivity",
    original_price: 599,
    sale_price:     349,
    quantity:       600,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
  },
  {
    category_id:    catBooks,
    product_name:   "Clean Code — Robert C. Martin",
    slug:           "clean-code-robert-martin",
    description:    "A handbook of agile software craftsmanship. Every developer's bible for writing readable, maintainable code.",
    product_type:   "Technology",
    original_price: 1299,
    sale_price:     999,
    quantity:       450,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80",
  },

  // ── HOME & KITCHEN (4) ───────────────────────────────────
  {
    category_id:    catHome,
    product_name:   "Instant Pot Duo 7-in-1",
    slug:           "instant-pot-duo-7-in-1",
    description:    "Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker & warmer. 6-quart capacity.",
    product_type:   "Cooking",
    original_price: 9999,
    sale_price:     7499,
    quantity:       200,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
  },
  {
    category_id:    catHome,
    product_name:   "Dyson V15 Detect Vacuum",
    slug:           "dyson-v15-detect-vacuum",
    description:    "Laser reveals microscopic dust. LCD screen shows what you have captured. 60-min fade-free power.",
    product_type:   "Cleaning",
    original_price: 62900,
    sale_price:     54990,
    quantity:       40,
    ratings:        4.8,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  },
  {
    category_id:    catHome,
    product_name:   "Himalayan Salt Lamp 5 kg",
    slug:           "himalayan-salt-lamp-5kg",
    description:    "100 % authentic pink Himalayan salt, warm amber glow, dimmer switch included. UL-listed cord.",
    product_type:   "Decor",
    original_price: 1999,
    sale_price:     1299,
    quantity:       350,
    ratings:        4.4,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
  },
  {
    category_id:    catHome,
    product_name:   "Nespresso Vertuo Next Coffee Machine",
    slug:           "nespresso-vertuo-next",
    description:    "Centrifusion technology, 6 cup sizes, WiFi-enabled, 40-second heat-up, automatic capsule ejection.",
    product_type:   "Coffee Maker",
    original_price: 17999,
    sale_price:     14999,
    quantity:       85,
    ratings:        4.6,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },

  // ── SPORTS & FITNESS (3) ─────────────────────────────────
  {
    category_id:    catSports,
    product_name:   "Premium Cork Yoga Mat",
    slug:           "premium-cork-yoga-mat",
    description:    "Natural cork surface + rubber base. Non-slip, eco-friendly, anti-microbial. 6 mm thick, 183 cm long.",
    product_type:   "Yoga",
    original_price: 3499,
    sale_price:     2699,
    quantity:       400,
    ratings:        4.6,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
  },
  {
    category_id:    catSports,
    product_name:   "Adjustable Dumbbell Set 5–25 kg",
    slug:           "adjustable-dumbbell-set-5-25kg",
    description:    "Replaces 9 pairs of dumbbells. Quick-adjust selector dial, 2.5 kg increments. Space-saving design.",
    product_type:   "Strength Training",
    original_price: 24999,
    sale_price:     19999,
    quantity:       55,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    category_id:    catSports,
    product_name:   "Garmin Forerunner 255 GPS Watch",
    slug:           "garmin-forerunner-255-gps",
    description:    "Advanced running dynamics, race predictor, 14-day battery, HRV status, morning report.",
    product_type:   "Smartwatch",
    original_price: 30490,
    sale_price:     26490,
    quantity:       70,
    ratings:        4.7,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },

  // ── BEAUTY & HEALTH (2) ──────────────────────────────────
  {
    category_id:    catBeauty,
    product_name:   "The Ordinary Hyaluronic Acid 2% + B5",
    slug:           "the-ordinary-ha-2-b5",
    description:    "Multi-depth hydration with high, medium & low molecular weight hyaluronic acid plus vitamin B5.",
    product_type:   "Skincare",
    original_price: 999,
    sale_price:     799,
    quantity:       600,
    ratings:        4.5,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
  },
  {
    category_id:    catBeauty,
    product_name:   "Philips OneBlade Electric Shaver",
    slug:           "philips-oneblade-electric-shaver",
    description:    "Shave, trim, and edge — one blade does it all. Works on any hair length. 45-min charge, 60-min use.",
    product_type:   "Grooming",
    original_price: 2999,
    sale_price:     1999,
    quantity:       280,
    ratings:        4.3,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80",
  },

  // ── TOYS & GAMES (1) ─────────────────────────────────────
  {
    category_id:    catToys,
    product_name:   "LEGO Technic Bugatti Chiron",
    slug:           "lego-technic-bugatti-chiron",
    description:    "3 599 pieces, 1:8 scale. Moveable 8-speed gearbox, W16 engine pistons, 4 steering modes.",
    product_type:   "Building Sets",
    original_price: 18999,
    sale_price:     15999,
    quantity:       30,
    ratings:        4.9,
    status:         "active",
    image_url:      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80",
  },

]);

print("✓ Inserted 30 products");
print("");
print("==============================================");
print("  Seed complete! Summary:");
print("  - 7  categories");
print("  - 4  attributes  (Color, Size, Storage, RAM)");
print("  - 19 terms");
print("  - 30 products with Unsplash image URLs");
print("  Ready for frontend at http://localhost:5173");
print("==============================================");
