# 🖊️ Collaborative Whiteboard – MERN Stack

A real-time collaborative whiteboard application built using the **MERN stack** that allows multiple users to draw together in shared rooms. Users can register, log in securely, create or join rooms, and collaborate live with drawing updates synchronized across all connected clients.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login
- Password hashing using **bcrypt**
- **JWT-based authentication**
  - Access Token (15 minutes)
  - Refresh Token (7 days)
- Secure logout support

### 🧑‍🤝‍🧑 Collaboration
- Create a drawing room
- Join an existing room
- Leave room functionality
- Real-time user presence (shows who is connected)
- Live indicator of **who is currently drawing**

### 🎨 Whiteboard Tools
- Freehand drawing
- Color picker
- Eraser tool
- Clear canvas
- Real-time drawing sync using WebSockets

### ☁️ Deployment
- Frontend deployed on **Render**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

---

## 🛠️ Tech Stack

### Frontend
- React
- HTML5 Canvas
- Socket.IO Client
- CSS / Tailwind (if used)

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

### Database
- MongoDB Atlas

---

## 📁 Project Structure

