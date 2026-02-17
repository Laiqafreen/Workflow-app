import API from "./api"

const statsService = {
    getDashboardStats: async () => {
        const response = await API.get("/stats")
        return response.data
    }
}

export default statsService
