// Mock data for the dashboard app

export const mockTasks = [
  {
    id: 1,
    title: "Design new landing page",
    description: "Create wireframes and mockups for the new landing page",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-20",
    assignee: { name: "John Doe", avatar: "JD" },
    progress: 65,
    createdAt: "2024-02-10"
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Set up JWT tokens and refresh token flow",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-18",
    assignee: { name: "Jane Smith", avatar: "JS" },
    progress: 40,
    createdAt: "2024-02-08"
  },
  {
    id: 3,
    title: "Write API documentation",
    description: "Document all REST endpoints with examples",
    priority: "medium",
    status: "todo",
    dueDate: "2024-02-25",
    assignee: { name: "Mike Johnson", avatar: "MJ" },
    progress: 0,
    createdAt: "2024-02-12"
  },
  {
    id: 4,
    title: "Fix mobile responsive issues",
    description: "Address layout problems on mobile devices",
    priority: "medium",
    status: "completed",
    dueDate: "2024-02-15",
    assignee: { name: "Sarah Wilson", avatar: "SW" },
    progress: 100,
    createdAt: "2024-02-05"
  },
  {
    id: 5,
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing",
    priority: "low",
    status: "todo",
    dueDate: "2024-02-28",
    assignee: { name: "John Doe", avatar: "JD" },
    progress: 0,
    createdAt: "2024-02-14"
  },
  {
    id: 6,
    title: "Review code pull requests",
    description: "Review and merge pending pull requests",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-17",
    assignee: { name: "Jane Smith", avatar: "JS" },
    progress: 80,
    createdAt: "2024-02-11"
  }
]

export const mockUser = {
  name: "Alex Thompson",
  email: "alex.thompson@taskflow.com",
  avatar: "AT",
  role: "Project Manager"
}

export const mockNotifications = [
  {
    id: 1,
    title: "New task assigned",
    message: "You have been assigned to 'Design new landing page'",
    read: false,
    timestamp: "2 hours ago",
    type: "assignment"
  },
  {
    id: 2,
    title: "Task completed",
    message: "Sarah Wilson completed 'Fix mobile responsive issues'",
    read: false,
    timestamp: "5 hours ago",
    type: "completion"
  },
  {
    id: 3,
    title: "Due date approaching",
    message: "3 tasks are due in the next 2 days",
    read: true,
    timestamp: "1 day ago",
    type: "reminder"
  },
  {
    id: 4,
    title: "Team update",
    message: "New team member joined the project",
    read: true,
    timestamp: "2 days ago",
    type: "team"
  }
]

export const mockStats = {
  totalTasks: 24,
  inProgress: 8,
  completed: 12,
  highPriority: 5
}

export const mockAnalytics = {
  completionRate: 75,
  tasksByStatus: {
    todo: 4,
    inProgress: 8,
    completed: 12
  },
  tasksByPriority: {
    high: 5,
    medium: 10,
    low: 9
  },
  weeklyProgress: [
    { day: "Mon", completed: 2 },
    { day: "Tue", completed: 5 },
    { day: "Wed", completed: 3 },
    { day: "Thu", completed: 7 },
    { day: "Fri", completed: 4 },
    { day: "Sat", completed: 1 },
    { day: "Sun", completed: 2 }
  ]
}

export const mockMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@taskflow.com",
    avatar: "JD",
    role: "Developer"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@taskflow.com",
    avatar: "JS",
    role: "Designer"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@taskflow.com",
    avatar: "MJ",
    role: "Backend Engineer"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@taskflow.com",
    avatar: "SW",
    role: "QA Engineer"
  },
  {
    id: 5,
    name: "Alex Thompson",
    email: "alex.thompson@taskflow.com",
    avatar: "AT",
    role: "Project Manager"
  }
]

export const mockProjects = [
  {
    id: 1,
    title: "TaskFlow Platform",
    status: "in-progress",
    progress: 65,
    dueDate: "2024-03-15",
    description: "Main platform development"
  },
  {
    id: 2,
    title: "Mobile App",
    status: "in-progress",
    progress: 40,
    dueDate: "2024-04-01",
    description: "iOS and Android app"
  },
  {
    id: 3,
    title: "Documentation",
    status: "todo",
    progress: 0,
    dueDate: "2024-03-30",
    description: "Complete API docs"
  },
  {
    id: 4,
    title: "Design System",
    status: "completed",
    progress: 100,
    dueDate: "2024-02-14",
    description: "UI component library"
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    status: "in-progress",
    progress: 75,
    dueDate: "2024-03-20",
    description: "Real-time analytics view"
  },
  {
    id: 6,
    title: "Integration Tests",
    status: "todo",
    progress: 0,
    dueDate: "2024-04-10",
    description: "E2E testing suite"
  }
]
