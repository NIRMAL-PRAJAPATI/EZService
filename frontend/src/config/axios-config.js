import axios from "axios";

// create axios instance
const api = axios.create(
    {
        // baseURL: import.meta.env.VITE_API_BACKEND_API,
        baseURL: "http://ec2-43-204-112-76.ap-south-1.compute.amazonaws.com",
        // baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type':'application/json'
        }
    }
)

export default api;