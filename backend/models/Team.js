import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a team name'],
      trim: true,
      minlength: [3, 'Team name must be at least 3 characters']
    },
    description: {
      type: String,
      default: ''
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
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

teamSchema.index({ createdBy: 1 })
teamSchema.index({ members: 1 })

const Team = mongoose.model('Team', teamSchema)
export default Team
