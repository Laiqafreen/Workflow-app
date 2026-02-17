import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a notification title']
    },
    message: {
      type: String,
      required: [true, 'Please provide a notification message']
    },
    type: {
      type: String,
      enum: ['assignment', 'completion', 'reminder', 'team', 'system'],
      default: 'system'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    relatedTask: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
      default: null
    },
    relatedProject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      default: null
    }
  },
  { timestamps: true }
)

notificationSchema.index({ user: 1, read: 1 })
notificationSchema.index({ createdAt: -1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
