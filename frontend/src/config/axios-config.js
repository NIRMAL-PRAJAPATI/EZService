import axios from "axios";

// create axios instance
const api = axios.create(
    {
        baseURL: 'http://ec2-43-204-112-76.ap-south-1.compute.amazonaws.com',
        // baseURL: 'http://ec2-43-204-112-76.ap-south-1.compute.amazonaws.com',
        headers: {
            'Content-Type':'application/json'
        }
    }
)

export default api;