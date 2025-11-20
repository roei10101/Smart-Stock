# 🚀 Smart-Stock: Intelligent Inventory & Sales Manager

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

**Smart-Stock** is a comprehensive, full-stack web application designed to streamline inventory tracking, sales management, and financial analysis for small to medium-sized businesses.

It provides a centralized platform for managing products, tracking seller performance, monitoring expenses, and visualizing real-time business insights through a professional dashboard. The system is optimized for performance, supports Right-to-Left (RTL) layout, and provides detailed financial reporting.

---

## ✨ Key Features

### 🔐 Security & User Management
* **Secure Authentication:** Robust login and registration system using **JWT (JSON Web Tokens)**.
* **Role-Based Access Control (RBAC):** Distinct permissions for **Admins** (full control) and **Users** (sellers).

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

## 📸 Screenshots

> *Placeholders for application screenshots.*

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* **Java 17** JDK installed.
* **Node.js** (LTS) and npm installed.
* **PostgreSQL** installed and running.
* **Maven** installed.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/smart-stock.git](https://github.com/your-username/smart-stock.git)
cd smart-stock

### 2. Backend Setup
1.  **Database:** Create a new PostgreSQL database named `smartstock`.
2.  **Configuration:** The project uses `application.properties`. For local development, default settings may suffice, but ensure your database credentials match.
3.  **Build & Run:**
    ```bash
    # Navigate to backend directory (if separated)
    mvn clean install
    java -jar target/SmartStock-0.0.1-SNAPSHOT.jar
    ```
    *The server will start on port `8080`.*

### 3. Frontend Setup
1.  **Navigate to frontend:**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm start
    ```
    *The application will launch at `http://localhost:3000`.*
	
	## ⚙️ Configuration & Environment Variables

For production environments or custom local setups, you can set the following environment variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_URL` | JDBC URL for PostgreSQL | `jdbc:postgresql://host:5432/db_name` |
| `DB_USERNAME` | Database Username | `postgres` |
| `DB_PASSWORD` | Database Password | `secure_password` |
| `JWT_SECRET_KEY` | Secret key for signing tokens | `YourVeryLongAndSecureSecretKey...` |
| `DDL_AUTO` | Hibernate DDL strategy | `validate` (prod) or `update` (dev) |

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

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.