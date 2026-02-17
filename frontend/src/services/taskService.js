import API from "./api"

const taskService = {
    getAllTasks: async () => {
        const response = await API.get("/tasks")
        return response.data
    },

    createTask: async (taskData) => {
        const response = await API.post("/tasks", taskData)
        return response.data
    },

    updateTask: async (id, taskData) => {
        const response = await API.put(`/tasks/${id}`, taskData)
        return response.data
    },

    deleteTask: async (id) => {
        const response = await API.delete(`/tasks/${id}`)
        return response.data
    },

    getTasksByStatus: async (status) => {
        const response = await API.get(`/tasks/status/${status}`)
        return response.data
    }
}

export default taskService
