import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters']
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      require: true
    },
    assignee: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please assign a user to this task']
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Index for faster queries
taskSchema.index({ createdBy: 1, status: 1 })
taskSchema.index({ assignee: 1 })
taskSchema.index({ dueDate: 1 })

const Task = mongoose.model('Task', taskSchema)
export default Task
