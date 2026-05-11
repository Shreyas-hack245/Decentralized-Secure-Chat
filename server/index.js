const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("send_message", (data) => {

    socket.broadcast.emit(
      "receive_message",
      data
    );

  });

});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});