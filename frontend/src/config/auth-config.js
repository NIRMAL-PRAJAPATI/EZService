import axios from "axios";

// create axios instance
const authApi = axios.create(
    {
        // baseURL: import.meta.env.VITE_API_BACKEND_API,
        baseURL: "https://ezservice.duckdns.org",
        // baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type':'application/json'
        }
    }
)

authApi.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

authApi.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if(error.response.status === 401){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default authApi;