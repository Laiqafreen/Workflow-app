import Connection from '../models/Connection.js'
import User from '../models/User.js'

// Send Friend Request
export const sendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body
        const requesterId = req.user._id

        if (requesterId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot send a request to yourself" })
        }

        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        })

        if (existingConnection) {
            return res.status(400).json({ message: "Connection already exists or is pending" })
        }

        const newConnection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        })

        res.status(201).json({ success: true, data: newConnection })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get All Requests (Pending & Accepted)
export const getRequests = async (req, res) => {
    try {
        const userId = req.user._id

        const connections = await Connection.find({
            $or: [{ requester: userId }, { recipient: userId }]
        })
            .populate('requester', 'name email avatar role')
            .populate('recipient', 'name email avatar role')

        res.status(200).json({ success: true, data: connections })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Accept Request
export const acceptRequest = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const connection = await Connection.findById(id)

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" })
        }

        if (connection.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to accept this request" })
        }

        connection.status = 'accepted'
        await connection.save()

        res.status(200).json({ success: true, data: connection })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Reject/Cancel Request
export const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const connection = await Connection.findById(id)

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" })
        }

        // Allow both requester (cancel) and recipient (reject) to delete
        if (
            connection.recipient.toString() !== userId.toString() &&
            connection.requester.toString() !== userId.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" })
        }

        await connection.deleteOne()

        res.status(200).json({ success: true, message: "Request removed" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
