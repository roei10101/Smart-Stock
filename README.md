# 🚀 Smart-Stock: Intelligent Inventory & Sales Manager

[![CI](https://github.com/roei10101/Smart-Stock/actions/workflows/ci.yml/badge.svg)](https://github.com/roei10101/Smart-Stock/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

**Smart-Stock** is a comprehensive, full-stack web application designed to streamline inventory tracking, sales management, and financial analysis for small to medium-sized businesses.

It provides a centralized platform for managing products, tracking seller performance, monitoring expenses, and visualizing real-time business insights through a professional dashboard. The system is optimized for performance, supports Right-to-Left (RTL) layout, and provides detailed financial reporting.

🌐 **Live demo:** https://smartstock.roeiduenyas.me

---

## ✨ Key Features

### 🔐 Security & User Management
* **Secure Authentication:** Stateless login using **JWT (JSON Web Tokens)** with BCrypt-hashed passwords.
* **Safe by default:** Self-registration always creates a regular user (a role sent by the client is ignored), invalid or expired tokens are rejected with `401`, and no secret has a default value in the code.

### 📦 Inventory Management
* **Product Operations:** Full CRUD (Create, Read, Update, Delete) capabilities.
* **Variant Tracking:** Manage complex inventory with product variations (e.g., sizes, colors), tracking stock levels for each specific variant separately.

### 💰 Sales & Expenses
* **Transaction Logging:** Record sales with automatic links to specific products, sellers, and customers.
* **Auto-Stock Update:** Inventory levels automatically adjust instantly upon sale completion.
* **Expense Tracking:** Log business expenses associated with specific sellers and dates for accurate net profit calculation.

### 👥 CRM (Customer & Seller Management)
* **Automated CRM:** Automatically generate and update customer profiles during sales transactions.
* **Seller Management:** Manage the roster of employees/sellers within the system to track individual performance.

### 📊 Advanced Analytics Dashboard
* **KPI Overview:** Instant view of total revenue, total sales count, and current stock levels.
* **Visual Charts:**
  * Sales by Product & Seller.
  * Revenue Distribution (Pie Charts).
  * Sales Trends over Time (Line Charts).
* **Financial Reports:** Detailed **Balance Sheet** showing Income vs. Expenses and Net Profit per seller and for the store globally.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
| :--- | :--- |
| **Java 17** | Core Programming Language |
| **Spring Boot 3** | Application Framework |
| **Spring Security** | Authentication & Authorization |
| **Spring Data JPA** | ORM & Data Persistence (Hibernate) |
| **PostgreSQL** | Relational Database |
| **JJWT** | JSON Web Token management |
| **Maven** | Dependency Management |
| **Lombok** | Boilerplate code reduction |

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI Library |
| **Material UI (MUI v5)** | Component Library & Design System |
| **Axios** | HTTP Client for API requests |
| **Recharts** | Data Visualization & Charts |
| **React Router** | Client-side Routing |

---

## 🚀 Getting Started

### Option 1: Docker (recommended)

Requires Docker with Compose v2.

```bash
git clone https://github.com/roei10101/Smart-Stock.git
cd Smart-Stock

# 1. Create your local configuration - no secret is stored in the repository
cp .env.example .env
#    then set DB_PASSWORD (openssl rand -hex 24) and JWT_SECRET_KEY (openssl rand -base64 48)

# 2. Start PostgreSQL and the backend
docker compose up --build
```

The API is now on `http://localhost:8080` (health check: `/actuator/health`). Compose refuses to start when a required secret is missing.

Then start the frontend:

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8080" > .env.local
npm start        # http://localhost:3000
```

To get a `demo` / `demo` account for a first login, set `DEMO_USER_ENABLED=true` in `.env`.

### Option 2: Manual backend setup

Requires **Java 17**, **Maven** and a running **PostgreSQL** with a database named `smartstock`.

```bash
cd backend
export DB_PASSWORD=...        # your PostgreSQL password
export JWT_SECRET_KEY=...     # openssl rand -base64 48
mvn spring-boot:run           # http://localhost:8080
```

---

## ⚙️ Configuration

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `DB_PASSWORD` | ✅ | Database password | - |
| `JWT_SECRET_KEY` | ✅ | Base64 encoded signing key, at least 256 bits | - |
| `DB_URL` | | JDBC URL for PostgreSQL | `jdbc:postgresql://localhost:5432/smartstock` |
| `DB_USERNAME` | | Database username | `postgres` |
| `SERVER_PORT` | | Port the API listens on | `8080` |
| `CORS_ALLOWED_ORIGINS` | | Comma separated list of allowed origins | hosted frontend + `http://localhost:3000` |
| `DDL_AUTO` | | Hibernate DDL strategy: `update` (dev) or `validate` (prod) | `update` |
| `DEMO_USER_ENABLED` | | Create a `demo` / `demo` account on startup | `false` |
| `REACT_APP_API_URL` | | Frontend build time: URL of the API | hosted backend |

The application fails fast at startup when a required variable is missing. `docker-compose.shared-db.yml` is a variant for hosts where PostgreSQL already runs in another Compose project.

---

## 🧪 Tests & CI

```bash
cd backend && mvn verify                     # unit + integration tests (in-memory H2, no setup needed)
cd frontend && npm test -- --watchAll=false  # frontend unit tests
```

* **Stock bookkeeping** - selling deducts stock, deleting a sale returns it, overselling is rejected and leaves stock untouched.
* **Security** - the full Spring Security filter chain is exercised end to end: protected endpoints need a valid token, forged / malformed / orphaned tokens are rejected, passwords are stored hashed and registration cannot grant `ADMIN`.
* **Frontend** - route guarding and the API client's token handling.

Every push and pull request runs these suites plus a Docker image build in [GitHub Actions](.github/workflows/ci.yml).

---

## 🔌 API Endpoints Overview

### Auth
* `POST /api/auth/register` - Register new user
* `POST /api/auth/login` - Authenticate & get Token

### Core Resources
* `GET /api/products` - List inventory
* `POST /api/sales` - Record a sale
* `POST /api/expenses` - Log an expense
* `GET /api/sellers` - List sellers
* `GET /api/customers` - List customers

### Analytics
* `GET /api/dashboard/summary` - High-level KPIs
* `GET /api/dashboard/sales-by-product` - Chart data
* `GET /api/balance-sheet` - Financial reports

### Operations
* `GET /actuator/health` - Health check (public)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
