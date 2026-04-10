# 🛒 EBS E-Commerce — Complete Developer Guide

> **From Monolith to Microservices** — Everything explained from ground zero so you can understand, run, modify, and master this project.

---

## 📋 Table of Contents

1. [What is this project?](#1-what-is-this-project)
2. [Tech Stack — What and Why](#2-tech-stack--what-and-why)
3. [Understanding the Original Monolith](#3-understanding-the-original-monolith)
4. [What are Microservices?](#4-what-are-microservices)
5. [The Full Architecture](#5-the-full-architecture)
6. [Every Service Explained](#6-every-service-explained)
7. [How Services Talk to Each Other (Feign)](#7-how-services-talk-to-each-other-feign)
8. [The Database — MongoDB](#8-the-database--mongodb)
9. [The Frontend — React](#9-the-frontend--react)
10. [API Reference — All Endpoints](#10-api-reference--all-endpoints)
11. [Running the Project Locally](#11-running-the-project-locally)
12. [Seed Data](#12-seed-data)
13. [Folder Structure — Full Map](#13-folder-structure--full-map)
14. [Common Errors & Fixes](#14-common-errors--fixes)
15. [Key Concepts Glossary](#15-key-concepts-glossary)

---

## 1. What is this project?

**EBS** (E-commerce Based System) is a **full-stack online shopping application** — think Amazon, but built from scratch as a learning project.

### What a user can do:
- Browse products with real images and prices
- Filter by category, search by name
- Register/Login with a secure account
- Add products to a cart
- Place an order (which automatically reduces stock)
- Make a payment for their order
- Admin can update order status (Pending → Shipped → Delivered)

### The project has 3 major layers:

```
┌─────────────────────┐
│   React Frontend    │  ← What the user sees in their browser
├─────────────────────┤
│  Spring Boot APIs   │  ← Business logic, rules, data processing
├─────────────────────┤
│  MongoDB Database   │  ← Stores all data permanently
└─────────────────────┘
```

---

## 2. Tech Stack — What and Why

### Frontend
| Technology | What it is | Why we use it |
|---|---|---|
| **React.js** | JavaScript library for building UIs | Fast, component-based, industry standard |
| **Vite** | Build tool / dev server | Starts in milliseconds, hot reload |
| **React Router** | Page navigation without full reloads | SPA (Single Page App) navigation |
| **Axios** | HTTP client to call the backend | Simpler than native `fetch` |
| **react-hot-toast** | Toast notification popups | Clean success/error messages |

### Backend
| Technology | What it is | Why we use it |
|---|---|---|
| **Java 17** | Programming language | Mature, strongly typed, enterprise standard |
| **Spring Boot 3.2** | Java web framework | Auto-configures everything, fast to build APIs |
| **Spring Data MongoDB** | Database connection layer | Write queries as Java methods, no raw SQL/MQL |
| **Spring Cloud Gateway** | API Gateway | Single entry point, routes to microservices |
| **Eureka Server** | Service Discovery | Services find each other by name, not IP |
| **OpenFeign** | HTTP client between services | Call another service like a local Java method |
| **Lombok** | Code generator | Removes boilerplate (`@Data`, `@Builder`, etc.) |
| **BCrypt** | Password hashing algorithm | Passwords are never stored as plain text |

### Database
| Technology | What it is | Why we use it |
|---|---|---|
| **MongoDB** | NoSQL document database | Flexible schema, JSON-like documents, great for e-commerce catalogs |

---

## 3. Understanding the Original Monolith

Before microservices, there was a **monolith** — a single Spring Boot application doing everything.

### What "monolith" means:
All code is in **one project**, **one JAR file**, runs on **one port (8080)**.

```
backend/
└── src/main/java/com/ebs/
    ├── controller/     ← Handles HTTP requests
    ├── service/        ← Business logic
    ├── repository/     ← Database queries
    ├── model/          ← Data structures (Java classes ↔ MongoDB documents)
    ├── config/         ← CORS settings
    └── exception/      ← Error handling
```

### The monolith's services:

| Service Class | What it did |
|---|---|
| `UserService` | Register, login, manage user profiles |
| `CatalogService` | CRUD for products, categories, attributes, terms |
| `CartService` | Add/remove/update items in a shopping cart |
| `OrderService` | Convert a cart into an order, reduce stock atomically |
| `PaymentService` | Create and track payments for orders |

### Why move away from a monolith?

| Problem | Description |
|---|---|
| **One failure = total failure** | If the payment code crashes, the entire site goes down |
| **Hard to scale** | You cannot scale only the product catalog — you must scale everything |
| **Slow deployments** | Changing one line requires redeploying everything |
| **Team conflicts** | Multiple developers editing the same codebase causes merge conflicts |

---

## 4. What are Microservices?

**Microservices** = splitting one big application into multiple small, independent applications.

Each small app:
- Has its **own code** (controller, service, repository)
- Runs on its **own port**
- Can be **started/stopped/scaled independently**
- Has a **single job** (user management, product catalog, etc.)

### Simple analogy:
```
MONOLITH:  One giant restaurant doing everything
           (cooking, serving, billing, cleaning — all one team)

MICROSERVICES: Multiple specialized shops in a food court
           - Kitchen A: Only makes pizzas
           - Kitchen B: Only makes sushi  
           - Cashier: Only handles payment
           - Receptionist: Directs you to the right kitchen
```

The **API Gateway** is the receptionist. The user only talks to the receptionist — they never dial directly into a kitchen.

---

## 5. The Full Architecture

```
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   localhost:5173    │
                    └──────────┬──────────┘
                               │  All HTTP requests go to :8080
                               ▼
              ┌────────────────────────────────┐
              │         API Gateway            │
              │         port: 8080             │
              │   (Spring Cloud Gateway)       │
              │   - Routes requests            │
              │   - Handles CORS globally      │
              └──────┬──────────────┬──────────┘
                     │              │  Discovers services via Eureka
                     ▼              ▼
         ┌───────────────────────────────────────────┐
         │           Eureka Server (port 8761)        │
         │      "Yellow Pages" — services register   │
         │      themselves here so gateway can        │
         │      find them by name (not IP/port)       │
         └───────┬──────────┬──────────┬─────────────┘
                 │          │          │
    ┌────────────▼──┐  ┌────▼──────┐  ┌▼─────────────────┐
    │  user-service │  │ catalog-  │  │   cart-service    │
    │   port 8081   │  │  service  │  │    port 8083      │
    │               │  │ port 8082 │  │ (calls catalog    │
    │  /api/users   │  │           │  │  via Feign)       │
    └───────────────┘  │/api/prod. │  └──────────────────┘
                       │/api/cat.  │
                       │/api/attr. │  ┌──────────────────────┐
                       │/api/terms │  │ order-payment-service│
                       └───────────┘  │     port 8084        │
                                      │ (calls cart-service  │
                                      │  via Feign)          │
                                      │                      │
                                      │ /api/orders          │
                                      │ /api/payments        │
                                      └──────────────────────┘
                                                │
                              ┌─────────────────▼──────────┐
                              │   MongoDB (port 27017)      │
                              │   Database: ecommerce       │
                              │   Collections:              │
                              │   users, products,          │
                              │   categories, attributes,   │
                              │   terms, carts, orders,     │
                              │   payments                  │
                              └────────────────────────────┘
```

### Port Reference Card:
```
MongoDB        → 27017
Eureka Server  → 8761   (dashboard: http://localhost:8761)
API Gateway    → 8080   (the only port your frontend uses)
user-service   → 8081
catalog-service→ 8082
cart-service   → 8083
order-payment  → 8084
React frontend → 5173
```

---

## 6. Every Service Explained

### 🔐 user-service (port 8081)

**Job:** Everything about user accounts.

**Endpoints it handles (routed from gateway):**
```
POST   /api/users/register   → Create account (password gets BCrypt hashed)
POST   /api/users/login      → Verify credentials, return user object
GET    /api/users/{id}       → Get user profile
GET    /api/users            → List all users
PUT    /api/users/{id}       → Update name/phone/address
DELETE /api/users/{id}       → Delete account
```

**Key code — how BCrypt works:**
```java
// When registering:
user.setPassword(passwordEncoder.encode("mypassword123"));
// Stored in DB: "$2a$10$xyz...abc" (hashed, irreversible)

// When logging in:
passwordEncoder.matches("mypassword123", storedHash); // → true or false
```

---

### 📦 catalog-service (port 8082)

**Job:** Everything about what you sells — products, categories, attributes (like "Color"), and terms (like "Red", "Blue").

**Why is it called "catalog"?**
In retail, a "catalog" is the full listing of everything available for sale. So all product-related data lives here.

**Endpoints it handles:**
```
# Products
GET    /api/products                    → All products (or filter by ?status=active or ?search=keyword)
GET    /api/products/{id}              → Single product by ID
GET    /api/products/slug/{slug}       → Single product by URL slug (e.g. "apple-iphone-15-pro")
GET    /api/products/category/{catId}  → Products in a category
POST   /api/products                   → Create product
PUT    /api/products/{id}              → Update product
DELETE /api/products/{id}              → Delete product

# Categories
GET    /api/categories                 → All categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}

# Attributes (e.g. "Color", "Size")
GET    /api/attributes / {id}
POST   /api/attributes
PUT    /api/attributes/{id}
DELETE /api/attributes/{id}

# Terms (e.g. "Red", "XL" — values of attributes)
GET    /api/terms
GET    /api/terms/{id}
GET    /api/terms/attribute/{attributeId}   → All terms for a given attribute
POST   /api/terms
PUT    /api/terms/{id}
DELETE /api/terms/{id}
```

**What is a slug?**
A slug is a URL-friendly name for a product. Instead of `/products/507f1f77bcf86cd799439011` (ugly MongoDB ID), you use `/products/apple-iphone-15-pro` (human-readable).

---

### 🛒 cart-service (port 8083)

**Job:** Manage each user's shopping cart.

**Key design:** The cart stores items as an **embedded array** inside the cart document (not a separate collection). This is MongoDB's embedding pattern — fast reads, no JOINs.

```
Cart document in MongoDB:
{
  "_id": "...",
  "user_id": "user123",
  "items": [
    { "productId": "prod456", "quantity": 2 },
    { "productId": "prod789", "quantity": 1 }
  ]
}
```

**Endpoints:**
```
GET    /api/carts/{userId}                   → Get (or auto-create) cart
POST   /api/carts/{userId}/items             → Add item  { "productId": "...", "quantity": 1 }
PUT    /api/carts/{userId}/items/{productId} → Update quantity  { "quantity": 3 }
DELETE /api/carts/{userId}/items/{productId} → Remove item
DELETE /api/carts/{userId}                   → Clear entire cart
```

**Cross-service call:** Before adding an item, cart-service calls catalog-service via **Feign** to validate the product exists. If the product ID is fake, the add fails gracefully.

**Atomic operations used:**
```java
// Instead of: find → modify → save (3 steps, race condition possible)
// We use MongoDB atomic operators (1 step, safe):

$inc   → increment quantity by N     (addItem)
$push  → append new item to array    (addItem - new product)  
$pull  → remove item from array      (removeItem)
$set   → set a specific value        (updateItemQuantity, clearCart)
```

---

### 💳 order-payment-service (port 8084)

**Job:** Convert a cart into an order, handle payments. These two are combined in one service because payment always references an order — keeping them together prevents the need for cross-service database queries.

**Order placement flow (step by step):**
```
1. Frontend calls  POST /api/orders/place/{userId}
2. order-payment-service calls cart-service via Feign → gets user's cart items
3. For each cart item:
   a. Load product from MongoDB to get current price
   b. Atomically decrement stock: UPDATE products SET quantity = quantity - N
      WHERE quantity >= N  (prevents overselling!)
   c. If stock insufficient → throw error, nothing is saved
4. Create Order document with all items + total amount
5. Save order to MongoDB
6. Call cart-service via Feign to clear the user's cart
7. Return the saved Order to the frontend
```

**Endpoints:**
```
POST   /api/orders/place/{userId}       → Place order from cart
GET    /api/orders/user/{userId}        → All orders for a user
GET    /api/orders/{orderId}            → Single order
GET    /api/orders                      → All orders (admin)
PATCH  /api/orders/{orderId}/status     → Update status { "status": "SHIPPED" }

POST   /api/payments                    → Create payment { "orderId", "amount", "paymentMethod" }
GET    /api/payments/{paymentId}        → Single payment
GET    /api/payments/order/{orderId}    → Payment for a specific order
PATCH  /api/payments/{paymentId}/status → Update status { "status": "PAID" }
GET    /api/payments                    → All payments (admin)
```

**Order Status lifecycle:**
```
PENDING  →  SHIPPED  →  DELIVERED
   ↓
CANCELLED
```

**Payment Status lifecycle:**
```
PENDING  →  PAID
   ↓
FAILED
```

---

### 🌐 api-gateway (port 8080)

**Job:** The single front door for the entire system. The React frontend ONLY talks to port 8080 — it never directly calls 8081, 8082, etc.

**What gateway does:**
1. **Routes requests** — Looks at the URL path and forwards to the right service
2. **CORS handling** — Allows the React app (port 5173) to call the API (port 8080)
3. **Service discovery** — Uses Eureka to find where each service is running

**Routing table (from `application.yml`):**
```
/api/users/**      → USER-SERVICE     (http://localhost:8081)
/api/products/**   → CATALOG-SERVICE  (http://localhost:8082)
/api/categories/** → CATALOG-SERVICE
/api/attributes/** → CATALOG-SERVICE
/api/terms/**      → CATALOG-SERVICE
/api/carts/**      → CART-SERVICE     (http://localhost:8083)
/api/orders/**     → ORDER-PAYMENT    (http://localhost:8084)
/api/payments/**   → ORDER-PAYMENT
```

**Important:** The `lb://` prefix means "load-balanced" — the gateway asks Eureka for the service address rather than hardcoding it.

---

### 🗺️ eureka-server (port 8761)

**Job:** Service registry — like a phone book for microservices.

**How it works:**
1. When `user-service` starts, it **registers** itself: "I am USER-SERVICE and I'm at 192.168.1.5:8081"
2. When gateway wants to call user-service, it **asks Eureka**: "Where is USER-SERVICE?"
3. Eureka replies: "It's at 192.168.1.5:8081"

**Why this matters:** If you run multiple instances of catalog-service (for load), Eureka handles that automatically — the gateway will round-robin between them.

**Dashboard:** Open `http://localhost:8761` in your browser after starting Eureka — you can see all registered services.

---

## 7. How Services Talk to Each Other (Feign)

**OpenFeign** lets one service call another service's API like a regular Java method.

### Example: cart-service calling catalog-service

**Step 1:** Define a Feign interface (like a template):
```java
@FeignClient(name = "CATALOG-SERVICE")   // "CATALOG-SERVICE" matches the name in Eureka
public interface CatalogServiceClient {
    
    @GetMapping("/api/products/{id}")
    ResponseEntity<ProductDto> getProductById(@PathVariable("id") String id);
}
```

**Step 2:** Spring automatically creates an implementation at startup. You just inject and use it:
```java
@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CatalogServiceClient catalogServiceClient;   // injected automatically
    
    public Cart addItem(String userId, String productId, int quantity) {
        // This line actually makes an HTTP GET call to catalog-service!
        ResponseEntity<?> response = catalogServiceClient.getProductById(productId);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Product not found: " + productId);
        }
        // ... rest of add-to-cart logic
    }
}
```

### DTOs — Why they exist

When `order-payment-service` calls `cart-service`, it receives JSON back. That JSON needs a Java class to map into. But `order-payment-service` doesn't have access to `cart-service`'s `Cart.java`.

**Solution: DTOs (Data Transfer Objects)** — simple Java classes that only hold the data you need:

```java
// In order-payment-service/client/CartDto.java
public class CartDto {
    private String id;
    private String userId;
    private List<CartItemDto> items;   // just the data we need
}

public class CartItemDto {
    private String productId;
    private Integer quantity;
}
```

These mirror the JSON structure that `cart-service` returns.

---

## 8. The Database — MongoDB

### Why MongoDB instead of MySQL/PostgreSQL?

| Feature | SQL (MySQL) | NoSQL (MongoDB) |
|---|---|---|
| Data format | Tables with rows | JSON-like documents |
| Schema | Fixed — add column = alter table | Flexible — add field anytime |
| Relationships | JOINs across tables | Embedding or referencing |
| Great for | Transactions, reporting | Catalogs, user data, carts |

For e-commerce, MongoDB is great because:
- A product can have 5 attributes OR 20 — no schema change needed
- Cart items are naturally embedded inside a cart document
- Orders embed their items (snapshot) so historical orders stay correct even if the product changes

### Collections (equivalent to tables):

```javascript
// users collection
{
  "_id": ObjectId("..."),
  "name": "Kuganes Rathinam",
  "email": "kuganes@example.com",
  "password": "$2a$10$hashedpassword...",   // BCrypt hashed!
  "phone": "9876543210",
  "address": "Chennai, Tamil Nadu"
}

// products collection
{
  "_id": ObjectId("..."),
  "category_id": "...",                   // reference to categories._id
  "product_name": "Apple iPhone 15 Pro",
  "slug": "apple-iphone-15-pro",
  "description": "Titanium design...",
  "product_type": "Smartphone",
  "original_price": 134900,
  "sale_price": 124999,
  "quantity": 42,                          // decrements atomically on order
  "ratings": 4.8,
  "status": "active",
  "image_url": "https://images.unsplash.com/..."
}

// carts collection (items EMBEDDED — no separate collection)
{
  "_id": ObjectId("..."),
  "user_id": "...",
  "items": [                               // embedded array
    { "productId": "...", "quantity": 2 },
    { "productId": "...", "quantity": 1 }
  ]
}

// orders collection (items EMBEDDED — price snapshot)
{
  "_id": ObjectId("..."),
  "user_id": "...",
  "total_amount": 127998,
  "status": "PENDING",
  "created_at": "2026-04-10T07:30:00",
  "items": [                               // embedded array — price locked at purchase time!
    { "productId": "...", "quantity": 2, "price": 63999 }
  ]
}

// payments collection
{
  "_id": ObjectId("..."),
  "order_id": "...",
  "amount": 127998,
  "payment_status": "PENDING",
  "payment_method": "upi"
}
```

### Why items are embedded in orders (not referenced)

If you referenced the product, and then the seller changed the product price tomorrow, your order history would show the **wrong (new) price**. By embedding a **price snapshot** at purchase time, your orders always reflect what you actually paid.

### Atomic stock decrement — preventing overselling

Imagine 2 users simultaneously trying to buy the last iPhone in stock (quantity = 1):

```
❌ BAD (race condition):
  User A: reads quantity = 1 → ok
  User B: reads quantity = 1 → ok
  User A: sets quantity = 0  → saves
  User B: sets quantity = 0  → saves ← OVERSOLD! Two people bought the last one.

✅ GOOD (atomic MongoDB operation):
  UPDATE products
  SET    quantity = quantity - 1
  WHERE  _id = '...' AND quantity >= 1   ← only matches if stock is available

  If User A wins → quantity becomes 0
  If User B tries → document doesn't match the WHERE clause → 0 documents updated → error thrown
```

In code:
```java
Query stockQuery = new Query(
    Criteria.where("_id").is(productId)
            .and("quantity").gte(requestedQty)   // only match if enough stock
);
Update stockUpdate = new Update().inc("quantity", -requestedQty);
UpdateResult result = mongoTemplate.updateFirst(stockQuery, stockUpdate, Product.class);

if (result.getMatchedCount() == 0) {
    throw new RuntimeException("Insufficient stock!");
}
```

---

## 9. The Frontend — React

### File structure:
```
frontend/src/
├── api/index.js        ← All HTTP calls to the backend (organized by domain)
├── context/            ← Global state (CartContext, AuthContext/UserContext)
├── components/
│   ├── Navbar.jsx      ← Top navigation bar with search
│   └── ProductCard.jsx ← Single product card in the grid
└── pages/
    ├── Home.jsx        ← Product listing + category filter
    ├── ProductDetail.jsx ← Single product page with variant selectors
    ├── Cart.jsx        ← Shopping cart
    ├── Checkout.jsx    ← Place order + payment form
    ├── Dashboard.jsx   ← Admin: manage orders, view all data
    ├── Login.jsx       ← Login form
    └── Register.jsx    ← Registration form
```

### How API calls work (`api/index.js`):
```javascript
// All calls go to http://localhost:8080 (the API Gateway)
const api = axios.create({ baseURL: 'http://localhost:8080' });

export const productApi = {
  getAll:      (params) => api.get('/api/products', { params }),
  getById:     (id)     => api.get(`/api/products/${id}`),
  getBySlug:   (slug)   => api.get(`/api/products/slug/${slug}`),
  // ...
}
```

### How the product card renders an image:
```jsx
// ProductCard.jsx
{product.imageUrl ? (
  <img src={product.imageUrl} alt={product.productName} className="product-image" />
) : (
  <div className="product-image-placeholder">No Image</div>
)}
```
The `imageUrl` field in MongoDB contains a full Unsplash CDN URL, so the `<img>` tag loads it directly — no download or storage needed on your server.

### How routing works (React Router):
```
/              → Home.jsx (product grid)
/products/:slug → ProductDetail.jsx (single product)
/cart          → Cart.jsx
/checkout      → Checkout.jsx
/login         → Login.jsx
/register      → Register.jsx
/dashboard     → Dashboard.jsx (admin panel)
```

---

## 10. API Reference — All Endpoints

All endpoints are accessed through the Gateway at `http://localhost:8080`.

### Users `/api/users`
| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/register` | `{name, email, password, phone, address}` | Register new user |
| `POST` | `/login` | `{email, password}` | Login, returns User object |
| `GET` | `/{id}` | — | Get user by ID |
| `GET` | `/` | — | All users |
| `PUT` | `/{id}` | `{name, phone, address}` | Update profile |
| `DELETE` | `/{id}` | — | Delete user |

### Products `/api/products`
| Method | Path | Params | Description |
|---|---|---|---|
| `GET` | `/` | `?status=active` or `?search=iphone` | List products |
| `GET` | `/{id}` | — | Get by MongoDB ID |
| `GET` | `/slug/{slug}` | — | Get by slug (used by frontend) |
| `GET` | `/category/{catId}` | — | Products in category |
| `POST` | `/` | Product body | Create product |
| `PUT` | `/{id}` | Product body | Update product |
| `DELETE` | `/{id}` | — | Delete product |

### Carts `/api/carts`
| Method | Path | Body | Description |
|---|---|---|---|
| `GET` | `/{userId}` | — | Get or create cart |
| `POST` | `/{userId}/items` | `{productId, quantity}` | Add item |
| `PUT` | `/{userId}/items/{productId}` | `{quantity}` | Update qty |
| `DELETE` | `/{userId}/items/{productId}` | — | Remove item |
| `DELETE` | `/{userId}` | — | Clear cart |

### Orders `/api/orders`
| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/place/{userId}` | — | Place order from cart |
| `GET` | `/user/{userId}` | — | Orders for user |
| `GET` | `/{orderId}` | — | Single order |
| `GET` | `/` | — | All orders (admin) |
| `PATCH` | `/{orderId}/status` | `{status}` | Update status |

### Payments `/api/payments`
| Method | Path | Body | Description |
|---|---|---|---|
| `POST` | `/` | `{orderId, amount, paymentMethod}` | Create payment |
| `GET` | `/{paymentId}` | — | Single payment |
| `GET` | `/order/{orderId}` | — | Payment by order |
| `PATCH` | `/{paymentId}/status` | `{status}` | Update status |
| `GET` | `/` | — | All payments (admin) |

---

## 11. Running the Project Locally

### Prerequisites
- Java 17+ (`java -version`)
- Maven 3.6+ (`mvn -version`)
- Node.js 18+ (`node -v`)
- MongoDB running (`mongod --version`)

### Step 1 — Start MongoDB
```bash
# Make sure MongoDB is running
mongod
# Or if installed as service on Windows:
net start MongoDB
```

### Step 2 — Seed the database (one time only)
```bash
cd c:\dbms_project
mongosh ecommerce seed.js
```

### Step 3 — Start all backend services

#### Option A: One-click (Windows)
```bat
cd c:\dbms_project\microservices
start-all.bat
```
This opens 6 terminal windows in the correct startup order with automatic delays.

#### Option B: Manual (6 separate terminals, in this order)
```bash
# Terminal 1 — Start FIRST, wait 20 seconds
cd microservices/eureka-server
mvn spring-boot:run

# Terminal 2 (after Eureka is ready)
cd microservices/user-service
mvn spring-boot:run

# Terminal 3
cd microservices/catalog-service
mvn spring-boot:run

# Terminal 4 (after user+catalog are up)
cd microservices/cart-service
mvn spring-boot:run

# Terminal 5 (after cart is up)
cd microservices/order-payment-service
mvn spring-boot:run

# Terminal 6 — Start LAST
cd microservices/api-gateway
mvn spring-boot:run
```

### Step 4 — Start the frontend
```bash
cd c:\dbms_project\frontend
npm install         # first time only
npm run dev
```

### Step 5 — Verify everything is working
1. Open `http://localhost:8761` → Should show Eureka dashboard with 4 services registered
2. Open `http://localhost:5173` → Should show the product grid with images
3. Test an API: `curl http://localhost:8080/api/products`

### Startup order matters!
```
Eureka  →  user-service + catalog-service  →  cart-service  →  order-payment  →  gateway
```
The gateway must start last because it needs to discover all services via Eureka.

---

## 12. Seed Data

The seed script (`seed.js`) inserts:

### 7 Categories
Electronics, Clothing, Books, Home & Kitchen, Sports & Fitness, Beauty & Health, Toys & Games

### 4 Attributes + 19 Terms
| Attribute | Terms |
|---|---|
| Color | Black, White, Blue, Red, Green, Grey |
| Size | XS, S, M, L (+₹50), XL (+₹100), XXL (+₹150) |
| Storage | 64 GB, 128 GB (+₹500), 256 GB (+₹1200), 512 GB (+₹2500) |
| RAM | 4 GB, 8 GB (+₹800), 16 GB (+₹2000) |

### 30 Products with real Unsplash images
From ₹349 (Deep Work book) to ₹1,24,999 (iPhone 15 Pro). All have `status: "active"`, real ratings, accurate prices in INR, and working image URLs.

### Re-run seed (to reset data):
```bash
mongosh ecommerce seed.js
# It clears existing data first, then re-inserts everything fresh
```

---

## 13. Folder Structure — Full Map

```
c:\dbms_project\
│
├── seed.js                          ← MongoDB seed script (run once)
│
├── backend\                         ← ORIGINAL monolith (for reference)
│   └── src/main/java/com/ebs/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       ├── config/
│       └── exception/
│
├── frontend\                        ← React application
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                  ← Routes definition
│       ├── main.jsx                 ← Entry point
│       ├── index.css                ← Global styles
│       ├── api/index.js             ← All API calls
│       ├── context/                 ← Global state (cart, user)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProductCard.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── ProductDetail.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx
│           ├── Dashboard.jsx
│           ├── Login.jsx
│           └── Register.jsx
│
└── microservices\                   ← NEW microservices architecture
    ├── start-all.bat                ← Windows launch script
    │
    ├── eureka-server\               ← Service registry (port 8761)
    ├── api-gateway\                 ← Entry point for all requests (port 8080)
    ├── user-service\                ← User management (port 8081)
    ├── catalog-service\             ← Products, categories, etc. (port 8082)
    ├── cart-service\                ← Shopping cart (port 8083)
    └── order-payment-service\       ← Orders + payments (port 8084)

Each microservice has:
    ├── pom.xml
    └── src/main/
        ├── java/com/ebs/{name}/
        │   ├── {Name}Application.java   ← main() method
        │   ├── model/                   ← Java classes = MongoDB documents
        │   ├── repository/              ← Database query interfaces
        │   ├── service/                 ← Business logic
        │   ├── controller/              ← REST endpoints
        │   ├── client/                  ← Feign clients (inter-service calls)
        │   └── exception/               ← Error handling
        └── resources/application.yml   ← Port, MongoDB URL, Eureka config
```

---

## 14. Common Errors & Fixes

### ❌ "Connection refused to localhost:8761"
**Cause:** Trying to start a service before Eureka is ready.
**Fix:** Always start `eureka-server` first and wait 15–20 seconds.

### ❌ "No instances available for CATALOG-SERVICE"
**Cause:** cart-service started before catalog-service registered with Eureka.
**Fix:** Follow the startup order. Wait for catalog-service to be UP in Eureka dashboard before starting cart-service.

### ❌ "Email already registered"
**Cause:** You're trying to register with an email that already exists.
**Fix:** Use a different email, or run `db.users.deleteMany({})` in mongosh to reset users.

### ❌ "Cart is empty — cannot place order"
**Cause:** There's no cart for the user, or the cart has no items.
**Fix:** Add items to cart first via `POST /api/carts/{userId}/items`.

### ❌ "Insufficient stock for product"
**Cause:** The product's `quantity` in MongoDB is less than what you're ordering.
**Fix:** Update the product quantity via `PUT /api/products/{id}` or re-run the seed script.

### ❌ Frontend shows "No results found" (empty page)
**Cause:** Products in DB do not have `status: "active"` OR the backend is not running.
**Fix:** Check `mongosh ecommerce` → `db.products.countDocuments({status:"active"})`. If zero, run seed again.

### ❌ Images not loading (broken image icons)
**Cause:** The Unsplash URL is stale or you're offline.
**Fix:** Check internet connection. Unsplash images are CDN-hosted, so you need internet access.

### ❌ CORS error in browser console
**Cause:** Gateway CORS config not allowing the frontend origin.
**Fix:** Make sure `api-gateway/application.yml` has `http://localhost:5173` in `allowedOrigins`. Restart the gateway.

### ❌ Maven build fails
**Cause:** Java version mismatch or missing dependencies.
**Fix:**
```bash
mvn clean install -DskipTests   # force clean & download all deps
java -version                   # must show 17 or higher
```

---

## 15. Key Concepts Glossary

| Term | Simple Explanation |
|---|---|
| **REST API** | A set of rules for how a frontend talks to a backend using HTTP methods (GET, POST, PUT, DELETE) |
| **Endpoint** | A specific URL that the API responds to, e.g. `/api/products` |
| **JSON** | JavaScript Object Notation — the data format everything sends back and forth `{"name": "iPhone"}` |
| **Monolith** | All code in one application, one deployment unit |
| **Microservice** | A small, independent application with one specific job |
| **API Gateway** | The single entry point that routes all requests to the right microservice |
| **Eureka** | Service registry — the "phone book" that helps services find each other |
| **OpenFeign** | Library that lets you call another service's API like a local Java method |
| **DTO** | Data Transfer Object — a simple class used to carry data between services |
| **BCrypt** | A password hashing algorithm — converts passwords to irreversible gibberish before storing |
| **Slug** | A URL-friendly name: `apple-iphone-15-pro` instead of `Apple iPhone 15 Pro` |
| **Embedding** | Storing related data inside the same MongoDB document (cart items inside cart) |
| **Referencing** | Storing just an ID that points to another document (like a foreign key) |
| **Atomic operation** | A database operation that either fully succeeds or fully fails — no partial states |
| **Race condition** | A bug where two processes reading+writing at the same time produce wrong results |
| `@Document` | Spring annotation — maps a Java class to a MongoDB collection |
| `@RestController` | Spring annotation — marks a class as a REST API controller |
| `@Service` | Spring annotation — marks a class as a service (business logic layer) |
| `@RequiredArgsConstructor` | Lombok — auto-generates a constructor for all `final` fields (dependency injection) |
| `@FeignClient` | Spring Cloud annotation — creates an HTTP client from an interface |
| **`lb://`** | "Load balanced" — tells Gateway to use Eureka to find the service, not a hardcoded URL |
| **`application.yml`** | Configuration file — port, database URL, Eureka address for each service |
| `spring.application.name` | The name a service registers itself with in Eureka |
| **MongoTemplate** | Lower-level MongoDB API for atomic operations (`$inc`, `$push`, `$pull`, `$set`) |

---

## 🎓 Learning Path Recommendation

If you want to truly master this project, follow this order:

1. **Start with MongoDB** — understand documents, collections, embedding vs referencing
2. **Understand the monolith** (`backend/` directory) — read each controller + service pair together
3. **Understand Spring Boot basics** — `@RestController`, `@Service`, `@Repository`, `@Autowired`
4. **Run just the monolith** — `cd backend && mvn spring-boot:run`, test with Postman
5. **Understand the microservices one at a time** — start with `user-service` (simplest, no Feign)
6. **Understand Feign** — read `cart-service/client/CatalogServiceClient.java`
7. **Understand Eureka + Gateway** — check the dashboards, trace a request end-to-end
8. **Run the full system** — use `start-all.bat`, open `localhost:5173`
9. **Make changes** — try adding a new field to Product, see it flow through the system
10. **Break things intentionally** — stop one service, see what happens — this teaches resilience

---

*Built with ❤️ using Spring Boot 3.2, React.js, MongoDB, Spring Cloud Gateway, Eureka, and OpenFeign.*
