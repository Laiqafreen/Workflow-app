import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters']
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date']
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      // Team might be optional if we rely on members list, but let's keep it for compatibility
      // Making it optional if user wants ad-hoc projects, but user said "linked to a project"
      // Let's keep it required if it was, effectively the "Owner Team"
      required: false
    },
    members: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

projectSchema.index({ team: 1 })
projectSchema.index({ createdBy: 1 })
projectSchema.index({ status: 1 })

const Project = mongoose.model('Project', projectSchema)
export default Project
