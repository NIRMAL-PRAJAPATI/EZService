import axios from "axios";

// Authenticated API client: same backend URL as the public client (from .env),
// with the JWT attached to every request.
const authApi = axios.create(
    {
        baseURL: import.meta.env.VITE_API_BACKEND_API || 'http://localhost:3000',
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
        // Session expired or invalid: clear it and send the user to the right login page.
        if(error.response?.status === 401){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            const isProviderArea = window.location.pathname.startsWith('/provider')
            window.location.href = isProviderArea ? '/provider/login' : '/login'
        }
        return Promise.reject(error)
    }
)

export default authApi;
