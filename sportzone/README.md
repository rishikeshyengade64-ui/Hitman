# SportZone E-Commerce Platform

A production-grade, high-performance sports e-commerce application built around the Stitch **SportZone** design system (*Kinetic Obsidian*).

---

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios
- **Backend**: Spring Boot 3.3.x, Java 17, Spring Security 6 + JWT, Spring Data JPA, Hibernate, Flyway
- **Database**: Microsoft SQL Server (MSSQL)

---

## Project Structure

```
sportzone/
├── frontend/                     # React 18 + Vite + Tailwind application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Breadcrumbs, Badges
│   │   │   └── layout/           # MainLayout, AuthLayout
│   │   ├── pages/
│   │   │   ├── Home/             # Stitch Home Screen
│   │   │   ├── ProductListing/   # Stitch Catalog, Filters & Sorting
│   │   │   ├── ProductDetails/   # Stitch PDP with 5-angle gallery & telemetry
│   │   │   ├── CartCheckout/     # Stitch Cart, Shipping & SSL Checkout
│   │   │   ├── Auth/             # Login & Register
│   │   │   └── Orders/           # Order Success & History
│   │   ├── routes/               # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── services/             # apiClient.js (Axios + JWT interceptor), authService, productService, etc.
│   │   ├── context/              # AuthContext.jsx, CartContext.jsx
│   │   ├── hooks/                # useAuth.js, useCart.js
│   │   ├── utils/                # formatters.js, storage.js
│   │   └── constants/            # apiEndpoints.js, routes.js
│   ├── tailwind.config.js        # Stitch Kinetic Obsidian design tokens
│   └── package.json
│
├── backend/                      # Spring Boot 3 Backend
│   ├── src/main/java/com/yourorg/appname/
│   │   ├── config/               # SecurityConfig, CorsConfig
│   │   ├── controller/           # AuthController, ProductController, CartController, OrderController, etc.
│   │   ├── dto/                  # Request and Response DTOs
│   │   ├── entity/               # JPA Entities: User, Product, Category, CartItem, Order, etc.
│   │   ├── exception/            # GlobalExceptionHandler, Custom Exceptions
│   │   ├── mapper/               # Entity <-> DTO Mappers
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── security/             # JwtUtil, JwtAuthFilter, CustomUserDetailsService
│   │   └── service/              # Service interfaces & Implementations
│   ├── src/main/resources/
│   │   ├── application.properties# MSSQL datasource, Flyway & JWT settings
│   │   └── db/migration/         # Flyway versioned migration scripts
│   └── pom.xml
│
└── database/migrations/          # Version-controlled Flyway SQL Server migrations
    ├── V1__init_schema.sql       # DDL schema for all tables & indexes
    └── V2__seed_initial_data.sql # Initial categories, products & promo codes
```

---

## Getting Started

### 1. Database Setup (Microsoft SQL Server)

You can use either an existing local MSSQL instance or spin one up using Docker:

#### Option A: Run MSSQL via Docker
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" -p 1433:1433 --name sportzone-mssql -d mcr.microsoft.com/mssql/server:2022-latest
```

Create the database using `sqlcmd` or Azure Data Studio / SSMS:
```sql
CREATE DATABASE sportzone_db;
```

#### Option B: Local MSSQL Instance
Update `backend/src/main/resources/application.properties` with your credentials:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=sportzone_db;encrypt=true;trustServerCertificate=true
spring.datasource.driverClassName=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.datasource.username=sa
spring.datasource.password=YourStrong!Passw0rd
```

*Note: Flyway will automatically execute `V1__init_schema.sql` and `V2__seed_initial_data.sql` on startup to prepare the schema and initial tournament-spec catalog.*

---

### 2. Run the Backend

```bash
cd backend
# Windows:
mvnw.cmd spring-boot:run
# Or if Maven is globally installed:
mvn spring-boot:run
```

The Spring Boot backend will start on `http://localhost:8080`.

---

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
# (On Windows PowerShell if scripts are restricted, run: npm.cmd install && npm.cmd run dev)
```

The Vite development server will start at: `http://localhost:5173`.

---

## Seeded Accounts & Credentials

- **Demo Athlete Account**:
  - **Email**: `alex.mercer@sportzone.com`
  - **Password**: `Password123!`
  - *(Pre-populated on the login form for rapid testing)*
- **Promo Codes**:
  - `SPORT20`: **20% OFF** entire order (active across checkout)
  - `CHAMPION10`: **10% OFF** any order

---

## Key Features & Endpoints

- **Authentication (`/api/auth`)**:
  - `POST /api/auth/login`: Authenticates user and returns JWT Bearer token
  - `POST /api/auth/register`: Creates new athlete account
  - `GET /api/auth/me`: Validates session and returns profile
- **Catalog (`/api/products`, `/api/categories`)**:
  - `GET /api/products`: Parametric filtering by sport category, brand, price range, stock status, query, and sorting
  - `GET /api/products/{id}`: Full product telemetry, size variants, multi-angle images, and reviews
  - `GET /api/categories`: Discipline listings (Running, Football, Cricket, Basketball, Tennis, etc.)
- **Cart & Checkout (`/api/cart`, `/api/orders`, `/api/promos`)**:
  - `GET /api/cart`: Current user's cart
  - `POST /api/cart/items`: Add item with size/color variant
  - `POST /api/promos/validate`: Validates promo codes with minimum spend checks
  - `POST /api/orders`: Computes subtotal, applies promo discount, tax, shipping velocity, and creates confirmed order
