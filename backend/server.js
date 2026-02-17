import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'

// Route imports
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import teamRoutes from './routes/teamRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import connectionRoutes from './routes/connectionRoutes.js'

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Initialize app
const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json()) // Body parser

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/connections', connectionRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5001
const HOST = process.env.HOST || 'localhost'

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
