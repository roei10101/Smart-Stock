#!/bin/bash

# --- Configuration ---
# ערכים אלו ניתנים לשינוי
DB_NAME="smartstock_db"
DB_USER="smartstock_user"
DB_PASS="your_strong_password" # מומלץ בחום להחליף לסיסמה חזקה
REPO_URL="https://github.com/roei10101/Smart-Stock.git"
PROJECT_DIR="Smart-Stock"

# הפסק את הסקריפט אם אחת הפקודות נכשלת
set -e

echo "### Starting Smart-Stock Project Setup ###"

# --- שלב 1: התקנת תלויות (עבור Debian/Ubuntu) ---
echo "--- Step 1: Installing dependencies (git, jdk-17, maven, nodejs, postgresql) ---"
sudo apt-get update
sudo apt-get install -y git openjdk-17-jdk maven nodejs npm postgresql postgresql-contrib

# ודא ש-Node.js הותקן כראוי (לפעמים נדרש קישור סימבולי)
if ! command -v node &> /dev/null
then
    echo "Node.js command not found as 'node'. Creating symlink from 'nodejs' to 'node'."
    sudo ln -s /usr/bin/nodejs /usr/bin/node
fi


# --- שלב 2: הגדרת בסיס הנתונים PostgreSQL ---
echo "--- Step 2: Setting up PostgreSQL Database and User ---"
# הפעל והפעל את שירות PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# בדוק אם המשתמש והבסיס נתונים כבר קיימים כדי למנוע שגיאות בריצות חוזרות
if sudo -u postgres psql -t -c '\du' | cut -d \| -f 1 | grep -qw $DB_USER; then
    echo "Database user '$DB_USER' already exists. Skipping creation."
else
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
fi

if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database '$DB_NAME' already exists. Skipping creation."
else
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
fi

# --- שלב 3: שכפול המאגר ---
if [ -d "$PROJECT_DIR" ]; then
    echo "--- Step 3: Project directory '$PROJECT_DIR' already exists. Skipping clone. ---"
    cd $PROJECT_DIR
else
    echo "--- Step 3: Cloning project repository ---"
    git clone $REPO_URL
    cd $PROJECT_DIR
fi

# --- שלב 4: הגדרה והרצה של ה-Backend ---
echo "--- Step 4: Configuring, building, and running the Backend ---"
cd Backend

# יצירת קובץ application.properties עם פרטי החיבור
echo "Creating application.properties file..."
cat <<EOF > src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
server.port=8080
EOF

echo "Building Backend with Maven (this may take a few minutes)..."
mvn clean install -DskipTests

echo "Starting Backend server in the background... (Log: backend.log)"
nohup java -jar target/SmartStock-0.0.1-SNAPSHOT.jar > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

cd ..

# --- שלב 5: הגדרה והרצה של ה-Frontend ---
echo "--- Step 5: Installing dependencies and running the Frontend ---"
# שים לב לשגיאת הכתיב בשם התיקייה
cd Fronted

echo "Installing Frontend dependencies with npm..."
npm install

echo "Starting Frontend server in the background... (Log: frontend.log)"
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

cd ..

# --- סיום ---
echo ""
echo "### Setup Complete! ###"
echo "Backend is running on port 8080 (PID: $BACKEND_PID)."
echo "Frontend is running on port 3000 (PID: $FRONTEND_PID)."
echo ""
echo "To view logs:"
echo "  tail -f backend.log"
echo "  tail -f frontend.log"
echo ""
echo "To stop the servers:"
echo "  kill $BACKEND_PID"
echo "  kill $FRONTEND_PID"
echo ""
echo "You can now access the application at: http://<your_vm_ip>:3000"
