import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // Required to send and receive cookies from the browser
});

// Response interceptor to handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // The /refresh endpoint should read the refresh_token from httpOnly cookie
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request (it will now include the new access_token cookie)
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, probably session expired or invalid refresh cookie
        // The backend should have cleared the cookies already.
        // We just reject the error; the application logic (e.g., useAuth) should handle redirection.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
