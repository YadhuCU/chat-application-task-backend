const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = 3000 || process.env.PORT;

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log(`User id: ${socket.id} joined room: ${data}`);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("Send Message data: ", data);
    io.to(data.room).except(socket.id).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected Id: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SERVER IS RUNNING AT PORT:", PORT);
});
