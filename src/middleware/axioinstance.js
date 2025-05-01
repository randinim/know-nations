import axios from "axios"
import { getUserSession } from "./auth"

// Create an Axios instance with a configurable base URL
const axiosInstance = axios.create({
  baseURL: "https://uptight-jori-randinim-b299a63f.koyeb.app"
})

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  async config => {
    try {
      const session = await getUserSession()
      const { token } = session || {}

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: config.headers.Authorization || token
        }
      }

      if (config.originalUrl) {
        config.url = `${config.baseURL}${config.originalUrl}`
      }
    } catch (error) {
      console.error("Error retrieving user session or setting headers:", error)
    }

    return config
  },
  error => {
    console.error("Request error:", error)
    return Promise.reject(error)
  }
)

export default axiosInstance;
