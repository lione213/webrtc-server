const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { PeerServer } = require('peer'); // أضف هذه المكتبة

// PeerJS Server
const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  proxied: true
});

// Socket.IO Server
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.static("public"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("WebRTC Signaling Server is running");
});

// Socket.IO Events
io.on("connection", socket => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join", room => {
    socket.join(room);
    socket.to(room).emit("peer-connected", socket.id);

    socket.on("signal", data => {
      io.to(data.to).emit("signal", {
        from: socket.id,
        signal: data.signal
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      socket.to(room).emit("peer-disconnected", socket.id);
    });
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
