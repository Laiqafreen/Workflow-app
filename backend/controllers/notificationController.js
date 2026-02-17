import Notification from '../models/Notification.js'

export const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .populate('user', 'name email')
      .populate('relatedTask', 'title')
      .populate('relatedProject', 'title')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getUnreadNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.userId, read: false })
      .populate('user', 'name email')
      .populate('relatedTask', 'title')
      .populate('relatedProject', 'title')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    // Check if user is notification owner
    if (notification.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      })
    }

    notification.read = true
    await notification.save()

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { read: true }
    )

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    // Check if user is notification owner
    if (notification.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      })
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createNotification = async (req, res, next) => {
  try {
    const { title, message, type, user, relatedTask, relatedProject } = req.body

    const notification = await Notification.create({
      title,
      message,
      type,
      user,
      relatedTask,
      relatedProject
    })

    const populatedNotification = await notification.populate('user', 'name email').populate('relatedTask', 'title').populate('relatedProject', 'title')

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: populatedNotification
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
