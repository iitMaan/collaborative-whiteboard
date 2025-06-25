const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Setup express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "famous-donut-dfec3a.netlify.app"
    ],
    methods: ["GET", "POST"],
  },
});

// Socket.IO Events
io.on("connection", (socket) => {
  // Joining a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("request-sync", { roomId });
  });

  // Broadcasting drawing data
  socket.on("drawing", ({ roomId, pathData }) => {
    socket.to(roomId).emit("receive-drawing", pathData);
  });

  // Sync request from a client
  socket.on("request-sync", ({ roomId }) => {
    if (!roomId) {
      console.warn(`❌ Request sync failed: roomId is undefined from ${socket.id}`);
      return;
    }
    console.log(`Request sync from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("request-sync", { roomId });
  });

  // Full canvas sync from a client
  socket.on("sync-canvas", ({ roomId, objects }) => {
    if (!roomId) {
      console.warn(`❌ Sync-canvas failed: roomId is undefined from ${socket.id}`);
      return;
    }
    console.log(`Syncing canvas in room ${roomId} with ${objects.length} objects`);
    socket.to(roomId).emit("receive-sync", objects);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Socket.IO server running at http://localhost:${PORT}`);
});

// Root route
app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});
