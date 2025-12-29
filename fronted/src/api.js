import axios from 'axios';

// Create Axios instance with default settings
const api = axios.create({
    baseURL: 'https://smartstockbackend.roeiduenyas.me/',
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            // If token exists, add to Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Add CSRF Token
        const xsrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = xsrfToken;
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