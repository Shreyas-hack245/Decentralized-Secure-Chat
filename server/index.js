require("dotenv").config();

const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const cors = require("cors");

const mongoose = require("mongoose");

const Message = require("./models/Message");

const app = express();

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log(
    "MongoDB Connected"
  );

})

.catch((err) => {

  console.log(err);

});

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = 0;

io.on("connection", async (socket) => {

  onlineUsers++;

  io.emit(
    "online_users",
    onlineUsers
  );

  console.log("User connected");

  const oldMessages =
    await Message.find().sort({
      createdAt: 1,
    });

  socket.emit(
    "load_messages",
    oldMessages
  );

  socket.on(
    "send_message",
    async (data) => {

      const newMessage =
        new Message({

          username:
            data.username,

          text:
            data.text,

        });

      await newMessage.save();

      socket.broadcast.emit(
        "receive_message",
        data
      );

    }
  );

  socket.on("disconnect", () => {

    onlineUsers--;

    io.emit(
      "online_users",
      onlineUsers
    );

    console.log(
      "User disconnected"
    );

  });

});

server.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});