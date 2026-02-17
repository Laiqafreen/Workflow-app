import API from "./api"

const userService = {
    getAllUsers: async () => {
        const response = await API.get("/users")
        return response.data
    },

    deleteUser: async (id) => {
        const response = await API.delete(`/users/${id}`)
        return response.data
    },

    updateProfile: async (userData) => {
        const response = await API.put("/users/profile", userData)
        return response.data
    }
}

export default userService
