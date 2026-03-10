# Leave Management System

A full-stack web application for managing employee leave requests. Employees can apply for leave and track their status; employers can view and approve or reject requests.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Vue 3, Vite, Tailwind CSS, Pinia    |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (via Mongoose)        |
| Auth       | JWT (JSON Web Tokens), bcryptjs     |

---

## Features

### Employee
- Sign up and log in
- Apply for leave (type, start/end date, reason)
- View all own leave applications with status (Pending / Approved / Rejected)
- Filter leaves by status
- Dashboard with leave summary counters

### Employer / Manager
- Sign up and log in
- View all employee leave requests
- Filter requests by status
- Approve or reject requests with an optional review note
- Dashboard with pending request overview

### Security & Validation
- JWT-based authentication on all protected routes
- Role-based access control (employee vs employer routes)
- Frontend and backend input validation
- Passwords hashed with bcrypt (salt rounds: 12)

---

## Project Structure

```
leave-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Signup, login, get current user
│   │   └── leaveController.js # Apply, list, review leaves
│   ├── middleware/
│   │   └── auth.js            # JWT protect + restrictTo(role)
│   ├── models/
│   │   ├── User.js            # User schema (name, email, password, role)
│   │   └── Leave.js           # Leave schema (type, dates, status, etc.)
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/signup, /login; GET /me
│   │   └── leaves.js          # CRUD leave routes
│   ├── .env.example
│   ├── package.json
│   └── server.js              # App entry point
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── main.css       # Tailwind + custom component classes
    │   ├── components/
    │   │   ├── NavBar.vue
    │   │   └── StatusBadge.vue
    │   ├── router/
    │   │   └── index.js       # Vue Router with route guards
    │   ├── services/
    │   │   └── api.js         # Axios instance with JWT interceptor
    │   ├── store/
    │   │   ├── auth.js        # Pinia auth store
    │   │   └── leave.js       # Pinia leave store
    │   ├── views/
    │   │   ├── LoginView.vue
    │   │   ├── SignupView.vue
    │   │   ├── employee/
    │   │   │   ├── EmployeeLayout.vue
    │   │   │   ├── DashboardView.vue
    │   │   │   ├── ApplyLeaveView.vue
    │   │   │   └── MyLeavesView.vue
    │   │   └── employer/
    │   │       ├── EmployerLayout.vue
    │   │       ├── DashboardView.vue
    │   │       └── LeaveRequestsView.vue
    │   ├── App.vue
    │   └── main.js
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Setup & Local Development

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier is sufficient)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd leave-app
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leave_management?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

> **MongoDB Atlas Setup:**
> 1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
> 2. Create a database user with read/write permissions
> 3. Add `0.0.0.0/0` to the IP Allowlist (or your specific IP)
> 4. Copy the connection string from "Connect > Drivers" and paste it into `MONGODB_URI`

Install dependencies and start:

```bash
npm install
npm run dev      # development (nodemon)
# or
npm start        # production
```

The API will be available at `http://localhost:5000`.

### 3. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

The default `.env` points to the Vite proxy, so no changes are needed for local development. For a separate deployment, set:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## API Reference

### Auth

| Method | Endpoint           | Access  | Description           |
|--------|--------------------|---------|-----------------------|
| POST   | `/api/auth/signup` | Public  | Register a new user   |
| POST   | `/api/auth/login`  | Public  | Login and get token   |
| GET    | `/api/auth/me`     | Private | Get current user info |

### Leaves

| Method | Endpoint                   | Access   | Description                     |
|--------|----------------------------|----------|---------------------------------|
| POST   | `/api/leaves`              | Employee | Submit a leave application      |
| GET    | `/api/leaves/my`           | Employee | Get own leave requests          |
| GET    | `/api/leaves`              | Employer | Get all leave requests          |
| PATCH  | `/api/leaves/:id/review`   | Employer | Approve or reject a request     |
| GET    | `/api/leaves/:id`          | Both     | Get a specific leave by ID      |

All private routes require the header: `Authorization: Bearer <token>`

---

## Deployment

### Backend (e.g. Render, Railway, Fly.io)

1. Push the `backend/` folder to your Git repository
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`

### Frontend (e.g. Vercel, Netlify)

1. Push the `frontend/` folder
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend-url.com/api`

---

## Leave Types Supported

`Annual`, `Sick`, `Maternity`, `Paternity`, `Unpaid`, `Other`

---

## Notes

- Tokens are stored in `localStorage` and attached via Axios interceptor
- A `401` response automatically logs the user out and redirects to `/login`
- Frontend route guards prevent employees from accessing employer routes and vice versa
- All dates are validated: start date cannot be in the past; end date must be ≥ start date
