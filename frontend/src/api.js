import axios from 'axios';

// צור מופע של Axios עם הגדרות ברירת מחדל
const api = axios.create({
    baseURL: 'https://smartstockbackend.roeiduenyas.me/',
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