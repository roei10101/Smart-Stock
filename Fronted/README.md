# 🚀 Smart-Stock - Inventory & Sales Management System

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Smart-Stock is a comprehensive, web-based inventory and sales management system designed for small to medium-sized businesses. It provides a clear, intuitive, and fully responsive interface for managing products, tracking sales, monitoring expenses, and analyzing business performance through a professional dashboard.

![Smart-Stock Dashboard](./path/to/your/screenshot.png)
> **Note:** Replace the image path above with a screenshot of your application's dashboard.

---

## ✨ Key Features

- **Professional Dashboard:** A central hub with data visualizations for total revenue, sales volume, and performance metrics.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for products and their variants (e.g., different sizes and stock quantities).
- **Sales Tracking:** A dedicated module to log new sales, associate them with a seller and customer, and edit existing sales records.
- **Expense Management:** A complete CRUD system for tracking business expenses, with the ability to associate each expense with a seller.
- **Financial Reporting:**
    - **Balance Sheet:** A clear overview of total revenue vs. total expenses for the entire store and for each seller.
    - **Seller Statistics:** A detailed breakdown of each seller's performance, including sales count, revenue, expenses, and net balance.
- **Seller & Customer Management:** Full CRUD operations for managing sellers and customers.
- **Secure Authentication:** A robust login system using JWT (JSON Web Tokens) to protect application data.
- **Fully Responsive Design:** A professional and aesthetic UI optimized for both desktop and mobile (iPhone) devices, built with RTL (Right-to-Left) support for Hebrew.

---

## 💻 Tech Stack

| Frontend                               | Backend                                       |
| -------------------------------------- | --------------------------------------------- |
| **React.js** (v18)                     | **Java** (17+)                                |
| **Material-UI (MUI)** v5               | **Spring Boot**                               |
| **Recharts** (for charts)              | **Spring Security** (for Authentication)      |
| **React Router** v6                    | **JPA / Hibernate** (for Data Persistence)    |
| **Axios** (for API communication)      | **PostgreSQL / MySQL** (or other SQL DB)      |
| **CSS / Styled Components**            | **Maven / Gradle** (for Dependency Management)|

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js & npm:** [Download & Install Node.js](https://nodejs.org/) (LTS version recommended)
- **Java JDK:** [Download & Install Java](https://www.oracle.com/java/technologies/downloads/) (Version 17 or higher)
- **Maven or Gradle:** Installed and configured in your system's PATH.
- **Database:** An active instance of PostgreSQL, MySQL, or another preferred SQL database.

### Backend Setup

1. **Clone the Java Backend Repository**
   ```bash
   git clone <your-backend-repo-url>
   cd <backend-repo-folder>
   ```

2. **Configure Backend Properties**
   - Open `src/main/resources/application.properties` (or `.yml`).
   - Update the database connection settings with your database URL, username, and password:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/your_db_name
     spring.datasource.username=your_db_username
     spring.datasource.password=your_db_password
     spring.jpa.hibernate.ddl-auto=update
     ```
   - Set your JWT secret key:
     ```properties
     jwt.secret=YourSuperSecretKeyForJWTs
     ```

3. **Run the Backend Application**
   - Using Maven:
     ```bash
     mvn spring-boot:run
     ```
   - The backend server will start on `http://localhost:8080`.

### Frontend Setup

1. **Clone this Repository**
   ```bash
   git clone https://github.com/your-username/smart-stock-frontend.git
   cd smart-stock-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   or if you are using Yarn:
   ```bash
   yarn install
   ```

3. **Configure API Base URL**
   - Open `src/api.js`.
   - Ensure the `baseURL` points to your running backend server. For local development, this should be correct by default.
     ```javascript
     const api = axios.create({
         baseURL: 'http://localhost:8080/api',
     });
     ```

4. **Start the Frontend Application**
   ```bash
   npm start
   ```
   - The application will open in your browser at `http://localhost:3000`.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
