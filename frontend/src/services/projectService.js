import API from "./api"

const projectService = {
    getAllProjects: async () => {
        const response = await API.get("/projects")
        return response.data
    },

    createProject: async (projectData) => {
        const response = await API.post("/projects", projectData)
        return response.data
    },

    updateProject: async (id, projectData) => {
        const response = await API.put(`/projects/${id}`, projectData)
        return response.data
    },

    deleteProject: async (id) => {
        const response = await API.delete(`/projects/${id}`)
        return response.data
    }
}

export default projectService
