
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));

io.on("connection", socket => {
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
      socket.to(room).emit("peer-disconnected", socket.id);
    });
  });
});

http.listen(3000, () => {
  console.log("Server is running on port 3000");
});
