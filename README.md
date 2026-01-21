# CHATME – Real-Time Chat Application

CHATME is a full-stack real-time chat application designed to support one-to-one and group conversations with modern messaging features. The system provides user authentication, friend management, private and group chats, file attachments, notifications, and an administrative dashboard for monitoring platform activity.

The project emphasizes clean separation between client and server, scalable API design, and a responsive user interface suitable for both desktop and mobile use.

---

## Features

### User Features

- User authentication (sign up, login, logout)
- Profile management with avatar upload
- Search and add users
- Friend request system with notifications
- One-to-one private chats
- Group chat creation and management
- Real-time messaging with file attachments
- Persistent message history
- Responsive UI for different screen sizes

### Group Chat Features

- Create group chats with multiple members
- Add or remove members
- Rename group chats
- Delete group chats
- View group members and metadata

### Admin Features

- Admin-only dashboard
- View all registered users
- View all chats (private and group)
- View and audit all messages
- Platform analytics (users, chats, messages)
- Role-based access control for admin routes

---

## Technology Stack

### Frontend

- React (Vite)
- Material UI (MUI)
- Redux Toolkit & RTK Query
- Axios
- React Router
- Moment.js

### Backend

- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- Socket.IO
- Multer (file uploads)
- Cookie-based authentication
- CORS configuration

### Tooling

- Git & GitHub
- RESTful API design
- Modular project structure
- Environment-based configuration

---

## Project Structure

CHATME/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── hooks/
│ │ ├── lib/
│ │ └── constants/
│ └── index.html
│
├── server/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── app.js
│
└── README.md

---

## System Architecture

CHATME follows a classic client–server architecture:

1. **Client (React + Vite)**  
   Handles UI rendering, user interaction, and communicates with the backend using REST APIs and WebSockets.

2. **Server (Node.js + Express)**  
   Exposes APIs for authentication, users, chats, and messages, and manages business logic and authorization.

3. **Database (MongoDB)**  
   Stores users, chats, messages, and requests with persistent storage.

4. **Real-Time Layer (Socket.IO)**  
   Enables real-time messaging, typing indicators, and live updates.

---

## Authentication & Authorization

- Cookie-based authentication is used
- Session cookies are sent using `withCredentials`
- Protected routes enforce authentication
- Admin routes require elevated privileges
- Unauthorized access redirects users appropriately

---

## API Overview

### Authentication

- POST `/api/v1/user/login`
- POST `/api/v1/user/new`
- GET `/api/v1/user/logout`

### Users

- GET `/api/v1/user/me`
- GET `/api/v1/user/search`
- POST `/api/v1/user/request`
- POST `/api/v1/user/accept`

### Chats & Messages

- GET `/api/v1/chat/my`
- POST `/api/v1/chat/group`
- POST `/api/v1/message`
- GET `/api/v1/message/:chatId`

### Admin

- GET `/api/v1/admin/users`
- GET `/api/v1/admin/chats`
- GET `/api/v1/admin/messages`
- GET `/api/v1/admin/stats`

---

## Environment Variables

### Server (`server/.env`)

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret
- NODE_ENV=production

### Client (`client/.env`)

VITE_SERVER_URL=http://localhost:5000

---

## Local Development Setup

### Steps

```bash
git clone https://github.com/your-username/chatme.git
cd chatme

cd server
npm install
npm run dev

cd ../client
npm install
npm run dev
Client runs on http://localhost:5173
Server runs on http://localhost:5000

```

## Author

Subin Khatiwada

- Master’s Student – Mechatronics Engineer, Robotics & AIML
- Lappeenranta University of Technology (LUT)

### License

This project is intended for educational and portfolio purposes.
