import API from "./api"

const connectionService = {
    sendRequest: async (recipientId) => {
        const response = await API.post("/connections", { recipientId })
        return response.data
    },

    getRequests: async () => {
        const response = await API.get("/connections")
        return response.data
    },

    acceptRequest: async (id) => {
        const response = await API.put(`/connections/${id}/accept`)
        return response.data
    },

    rejectRequest: async (id) => {
        const response = await API.delete(`/connections/${id}`)
        return response.data
    }
}

export default connectionService
