import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        // 'Content-Type': 'application/json', // Let axios set this automatically
    }
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.warn("Session expired. Logging out.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            localStorage.removeItem("user");
            // Optional: Redirect to login page
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
