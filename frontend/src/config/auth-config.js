import axios from "axios";

// create axios instance
const authApi = axios.create(
    {
        baseURL: 'http://ec2-43-204-112-76.ap-south-1.compute.amazonaws.com',
        // baseURL: 'http://ec2-43-204-112-76.ap-south-1.compute.amazonaws.com',
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