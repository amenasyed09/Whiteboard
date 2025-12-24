import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { socketAuth } from "./middleware/socketAuth.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Track users in each room
const roomUsers = new Map();
// Track drawing history for each room
const roomDrawings = new Map();

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.user.name);

  // Join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.user.name} joined room ${roomId}`);

    // Add user to room tracking
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(socket.user.name);

    // Get all users currently in the room
    const usersInRoom = Array.from(roomUsers.get(roomId));

    // Send the current user list to the joining user
    socket.emit("room-users", { users: usersInRoom });

    // Send existing drawings to the new user
    if (roomDrawings.has(roomId)) {
      socket.emit("canvas-state", { drawings: roomDrawings.get(roomId) });
    }

    // Inform others in the room about the new user
    socket.to(roomId).emit("user-joined", { user: socket.user.name });
  });

  // Draw event
  socket.on("draw", ({ roomId, data }) => {
    // Store the drawing in room history
    if (!roomDrawings.has(roomId)) {
      roomDrawings.set(roomId, []);
    }
    roomDrawings.get(roomId).push(data);

    socket.to(roomId).emit("draw", {
      user: socket.user.name,
      data,
    });
  });

  // Clear canvas event
  socket.on("clear-canvas", ({ roomId }) => {
    // Clear the room's drawing history
    roomDrawings.set(roomId, []);
    
    // Notify all users in the room to clear their canvas
    io.to(roomId).emit("clear-canvas");
  });

  // Leave room on disconnect
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    rooms.forEach((roomId) => {
      // Remove user from room tracking
      if (roomUsers.has(roomId)) {
        roomUsers.get(roomId).delete(socket.user.name);
        if (roomUsers.get(roomId).size === 0) {
          roomUsers.delete(roomId);
          // Optionally clear drawings when room is empty
          // roomDrawings.delete(roomId);
        }
      }

      socket.to(roomId).emit("user-left", { user: socket.user.name });
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user.name);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start", err);
  }
};

startServer();