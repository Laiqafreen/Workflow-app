import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
})

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token")
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/"
    }
    
    // Log error for debugging
    console.error("API Error:", error.response?.data || error.message)
    
    return Promise.reject(error)
  }
)

export default API
