import axios from 'axios';

// Axios instance for API calls, with base URL from environment variable and interceptor for handling 401 errors (token expiration)
const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // import env variables on vite with import.meta.env
  baseURL: "https://reciclo3d-backend.onrender.com"
});

// Interceptor to catch 401 errors and handle token expiration by clearing the token cookie and redirecting to home page

// Check later if it works since I previously did this with a node backend, not nestjs
// And also if this still works considering I'm using jwt access tokens (don't remember if I stored them on cookies)
axiosInstance.interceptors.response.use(
  response => response,
  error => {

    if (error.response && error.response.data.statusCode === 401) {

      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      setTimeout(() => {
        window.location.href = '/';
      }, 3500);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
