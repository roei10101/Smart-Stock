import axios from 'axios';

// צור מופע של Axios עם הגדרות ברירת מחדל
// Set REACT_APP_API_URL at build time to point at another backend
// (for example http://localhost:8080); defaults to the hosted one.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://smartstockbackend.roeiduenyas.me/';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// הוספת "מיירט" (interceptor) לבקשות
api.interceptors.request.use(
    (config) => {
        // קח את הטוקן מה-localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            // אם הטוקן קיים, הוסף אותו ל-Header של הבקשה
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => {
        // If the request was successful, just return the response
        return response;
    },
    (error) => {
        // Check if the error is 401 or 403 (Unauthorized or Forbidden)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // The token is invalid or expired
            console.log("Token expired or invalid, logging out.");
            localStorage.removeItem('authToken'); // Remove the bad token
            window.location.href = '/login'; // Redirect to the login page
        }
        // For all other errors, just pass them along
        return Promise.reject(error);
    }
);
export default api;