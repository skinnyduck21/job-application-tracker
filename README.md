# Job Application Tracker (MERN)

A full-stack MERN application that allows users to track job and internship applications with authentication, filtering, and analytics.

## Features
- User authentication with JWT
- Add, view, and delete job applications
- Filter and search jobs by status and type
- Analytics dashboard with application stats
- Protected routes and secure data access

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Pages
- `/register` – Create an account
- `/login` – Login
- `/dashboard` – Manage job applications

## How it works
- Each job is linked to the authenticated user
- JWT is used to protect routes
- MongoDB aggregation is used for analytics

## Run Locally

```bash
# backend
cd server
npm install
npm run dev

# frontend
cd client
npm install
npm run dev
