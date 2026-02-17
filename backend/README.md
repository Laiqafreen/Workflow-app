# Taskflow Backend API

A production-ready REST API for task management built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication with JWT
- ✅ Complete task management (CRUD operations)
- ✅ Team collaboration with member management
- ✅ Project tracking with progress monitoring
- ✅ Notification system
- ✅ Role-based access control
- ✅ Security middleware (Helmet, Rate Limiting, CORS)
- ✅ Input validation with Joi
- ✅ Comprehensive error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, Helmet, express-rate-limit
- **Validation**: Joi
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development with hot reload
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/me` | Get current user profile | ✅ |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all tasks | ✅ |
| GET | `/:id` | Get task by ID | ✅ |
| GET | `/status/:status` | Get tasks by status | ✅ |
| POST | `/` | Create new task | ✅ |
| PUT | `/:id` | Update task | ✅ |
| DELETE | `/:id` | Delete task | ✅ |

### Team Routes (`/api/teams`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all teams | ✅ |
| GET | `/:id` | Get team by ID | ✅ |
| POST | `/` | Create new team | ✅ |
| PUT | `/:id` | Update team | ✅ |
| DELETE | `/:id` | Delete team | ✅ |
| POST | `/:id/members` | Add member to team | ✅ |
| DELETE | `/:id/members/:memberId` | Remove member from team | ✅ |

### Project Routes (`/api/projects`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all projects | ✅ |
| GET | `/:id` | Get project by ID | ✅ |
| GET | `/team/:teamId` | Get projects by team | ✅ |
| POST | `/` | Create new project | ✅ |
| PUT | `/:id` | Update project | ✅ |
| DELETE | `/:id` | Delete project | ✅ |

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all notifications | ✅ |
| GET | `/unread` | Get unread notifications | ✅ |
| POST | `/` | Create notification | ✅ |
| PUT | `/:id/read` | Mark notification as read | ✅ |
| PUT | `/mark/all-read` | Mark all as read | ✅ |
| DELETE | `/:id` | Delete notification | ✅ |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all users | ✅ |
| GET | `/:id` | Get user by ID | ✅ |
| GET | `/me` | Get current user | ✅ |
| PUT | `/profile` | Update profile | ✅ |
| DELETE | `/:id` | Deactivate user | ✅ |

## Request/Response Format

### Standard Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": { /* error details */ }
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**How to get a token:**

1. Register a new user:
   ```bash
   POST /api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securePassword123"
   }
   ```

2. Or login with existing credentials:
   ```bash
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "securePassword123"
   }
   ```

The response includes a `token` field that should be used in subsequent requests.

## Project Structure

```
backend/
├── config/          # Configuration files
│   ├── database.js  # MongoDB connection
│   └── jwt.js       # JWT configuration
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Task.js
│   ├── Team.js
│   ├── Project.js
│   └── Notification.js
├── controllers/     # Route handlers
│   ├── authController.js
│   ├── taskController.js
│   ├── teamController.js
│   ├── projectController.js
│   ├── userController.js
│   └── notificationController.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   ├── teamRoutes.js
│   ├── projectRoutes.js
│   ├── userRoutes.js
│   └── notificationRoutes.js
├── middleware/      # Express middleware
│   ├── auth.js      # JWT authentication and authorization
│   └── errorHandler.js
├── utils/           # Utility functions
│   ├── validation.js # Joi validation schemas
│   └── tokenHelper.js # Token generation
├── .env.example     # Environment template
├── package.json
└── server.js        # Main application file
```

## Database Models

### User
- `name` (string, required)
- `email` (string, unique, required)
- `password` (string, hashed, required)
- `role` (enum: user, admin, manager)
- `avatar` (string, optional)
- `isActive` (boolean, default: true)
- timestamps

### Task
- `title` (string, required)
- `description` (string, required)
- `status` (enum: todo, in-progress, completed)
- `priority` (enum: low, medium, high)
- `assignee` (User reference, required)
- `createdBy` (User reference, required)
- `dueDate` (date, required)
- `isActive` (boolean, default: true)
- timestamps

### Team
- `name` (string, required)
- `description` (string, optional)
- `members` (array of User references)
- `createdBy` (User reference, required)
- `isActive` (boolean, default: true)
- timestamps

### Project
- `title` (string, required)
- `description` (string, optional)
- `status` (enum: planning, active, completed, on-hold)
- `progress` (number, 0-100)
- `dueDate` (date, required)
- `team` (Team reference, required)
- `createdBy` (User reference)
- `isActive` (boolean, default: true)
- timestamps

### Notification
- `title` (string, required)
- `message` (string, required)
- `type` (enum: assignment, completion, reminder, team, system)
- `user` (User reference, required)
- `read` (boolean, default: false)
- `relatedTask` (Task reference, optional)
- `relatedProject` (Project reference, optional)
- timestamps

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/taskflow
NODE_ENV=development

# Server
PORT=5000
HOST=localhost

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Security Features

- **Password Hashing**: Passwords are hashed with bcryptjs (10 salt rounds)
- **JWT Authentication**: Stateless authentication with expiring tokens
- **Helmet.js**: HTTP security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: IP-based request rate limiting
- **Input Validation**: Joi schema validation
- **Authorization**: Role-based access control

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Returns details about missing/invalid fields
- **Authentication Errors**: JWT token issues, expired tokens
- **Authorization Errors**: User lacks required permissions
- **Database Errors**: Duplicate entries, invalid references
- **Server Errors**: Unexpected errors with optional stack traces

## Development

### Start Development Server
```bash
npm run dev
```

Uses `nodemon` for hot reload on file changes.

### API Health Check
```bash
GET http://localhost:5000/api/health
```

Returns server status and timestamp.

## Deployment

### Production Checklist

1. **Environment Setup**
   - Change `NODE_ENV` to `production`
   - Set strong `JWT_SECRET` (min 32 characters)
   - Update `MONGODB_URI` for cloud database
   - Configure `CORS_ORIGIN` for production domain

2. **Security**
   - Ensure HTTPS is enabled
   - Review rate limiting settings
   - Update CORS allowed origins
   - Enable database authentication

3. **Monitoring**
   - Set up error logging (e.g., Sentry)
   - Configure performance monitoring
   - Set up alerts for critical errors

### Deploy on Heroku
```bash
heroku create taskflow-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<strong-secret-key>
heroku config:set MONGODB_URI=<cloud-mongodb-uri>
git push heroku main
```

## Testing

Example requests using cURL:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get Tasks (requires token)
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your-token>"
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running locally or accessible via connection string
- Check `MONGODB_URI` in `.env`
- Verify network connectivity for cloud databases

### JWT Token Issues
- Token expired: User needs to login again
- Invalid token: Ensure proper format in Authorization header
- Missing token: Protected endpoints require valid JWT

### CORS Errors
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- Verify frontend is making requests to correct API URL

### Rate Limit Exceeded
- Wait 15 minutes (default window) or adjust `RATE_LIMIT_WINDOW`
- Only affects development; adjust limits in production as needed

## Support & Documentation

- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Documentation](https://jwt.io)

## License

ISC
