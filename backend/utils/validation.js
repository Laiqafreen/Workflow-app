import Joi from 'joi'

// User Validation Schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin', 'manager').default('user')
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// Task Validation Schemas
export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  assignee: Joi.string().required(),
  dueDate: Joi.date().required()
})

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(1000),
  status: Joi.string().valid('todo', 'in-progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  assignee: Joi.string(),
  dueDate: Joi.date()
})

// Team Validation Schemas
export const createTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  members: Joi.array().items(Joi.string())
})

// Project Validation Schemas
export const createProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo'),
  progress: Joi.number().min(0).max(100).default(0),
  dueDate: Joi.date().required(),
  team: Joi.string().required()
})

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      })
    }

    req.validatedData = value
    next()
  }
}
