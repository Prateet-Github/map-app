import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }, // allow frontend
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Listen for driver location updates
  socket.on("driverLocation", (data) => {
    console.log("🚖 Driver location:", data);
    // Broadcast to all clients
    socket.broadcast.emit("driverLocationUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = 5001;
server.listen(PORT, () => console.log(`✅ WebSocket server running on port ${PORT}`));