import axios from "axios";

// create axios instance
const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_BACKEND_API,
        // baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type':'application/json'
        }
    }
)

export default api;