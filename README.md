# Job Application Tracker (MERN)

A full-stack MERN application that helps users track job and internship applications with secure authentication, filtering, analytics, and full deployment.

## 🚀 Features

- User registration and login with JWT authentication
- Protected routes and user-specific data access
- Create, view, and delete job applications
- Search and filter jobs by status, type, and keywords
- Analytics dashboard using MongoDB aggregation
- Clean authentication UX with loading and success feedback
- Fully deployed frontend and backend

## 🛠 Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Authentication:** JWT, bcrypt
- **Deployment:**  
  - Backend: Render  
  - Frontend: Vercel

## 📄 Pages

- `/register` – Create a new user account
- `/login` – Authenticate user
- `/dashboard` – Manage job applications and view statistics

## ⚙️ How It Works

- Users authenticate using email and password
- JWT is issued on login and stored on the client
- Protected routes validate JWT before granting access
- Each job document is linked to a user via `createdBy`
- MongoDB aggregation pipelines power analytics and stats
- Frontend communicates with backend via REST APIs

## 🌐 Live Demo

- **Frontend:** Deployed on Vercel  
- **Backend API:** Deployed on Render  

## 💻 Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 🔐 Environment Variables (Backend)

Create a `.env` file in `server/` with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

## 📌 Key Learnings

- Implemented JWT-based authentication and route protection
- Designed REST APIs with user-level authorization
- Used MongoDB aggregation pipelines for analytics
- Deployed a full-stack MERN application with environment configuration
- Debugged real-world issues related to CORS, auth, and deployment
