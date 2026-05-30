const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const { doctors } = require("./data/clinics");
const { initQueues, startFakeRealtime } = require("./data/queueStore");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Initialize queue data
initQueues(doctors);

// API routes
app.use("/api", apiRoutes);

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// Start fake real-time queue simulation
startFakeRealtime(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🏥 SmartNavbat Backend running on port ${PORT}`);
});
