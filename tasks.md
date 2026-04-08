# E-Commerce Based System (EBS) - Project Roadmap

## Phase 1: Backend Setup & Database Modeling (Spring Boot + MongoDB)
- [ ] Initialize Spring Boot project with dependencies (Web, Data MongoDB, Lombok).
- [ ] Configure `application.properties` for MongoDB connection.
- [ ] [cite_start]Create `@Document` models for Independent Entities (Referencing)[cite: 38]:
  - [ ] `User`
  - [ ] `Category`
  - [ ] `Product`
  - [ ] `Payment`
  - [ ] `Attribute`
  - [ ] `Term`
- [ ] [cite_start]Create `@Document` models for Dependent Entities (Embedding)[cite: 39]:
  - [ ] `Cart` (with embedded `CartItem`)
  - [ ] `Order` (with embedded `OrderItem`)

## Phase 2: Backend Data Access & Business Logic
- [ ] Implement `MongoRepository` interfaces for all collections.
- [ ] [cite_start]Build `UserService` (Registration, profile management)[cite: 549].
- [ ] [cite_start]Build `CatalogService` (CRUD for Products, Categories, Attributes, Terms)[cite: 549].
- [ ] Build `CartService`:
  - [ ] Logic to `$push` and `$pull` items from the embedded array.
- [ ] Build `OrderService`:
  - [ ] Logic to calculate totals and transition cart to order.
  - [ ] [cite_start]Implement atomic `$inc` operations for thread-safe inventory reduction[cite: 688].
- [ ] Build `PaymentService` (Handle payment status transitions).

## Phase 3: REST API Layer
- [ ] Create `UserController` endpoints.
- [ ] Create `ProductController` endpoints (filtering, fetching by slug).
- [ ] Create `CartController` endpoints (add/update/remove items).
- [ ] Create `OrderController` endpoints (checkout, view history).
- [ ] Test all endpoints using Postman or Swagger.

## Phase 4: Frontend Setup & Architecture (React)
- [ ] Initialize React app (Vite or CRA).
- [ ] Setup routing (`react-router-dom`).
- [ ] Setup global state management (Context API or Redux) for User Session and Cart state.
- [ ] Configure Axios service for API calls to Spring Boot.

## Phase 5: Frontend Component Implementation
- [ ] Build `Navbar` (with dynamic cart item count).
- [ ] Build `ProductCatalog` page (list products, filter by category).
- [ ] Build `ProductDetail` page (select attributes/terms, add to cart).
- [ ] Build `Cart` page (adjust quantities, review items).
- [ ] Build `Checkout` page (process order, mock payment submission).
- [ ] Build `UserDashboard` (view past orders and statuses).

## Phase 6: Refinement & Optimization
- [ ] [cite_start]Ensure database indexes (e.g., email, slug) are functioning for read optimization [cite: 681-683].
- [ ] Handle UI error states and loading spinners.
- [ ] Final end-to-end integration testing.