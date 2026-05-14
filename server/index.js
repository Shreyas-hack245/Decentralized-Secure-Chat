require("dotenv").config();

const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const cors = require("cors");

const mongoose = require("mongoose");

const Message = require("./models/Message");
const Chat = require("./models/Chat");
const User = require("./models/User");

const app = express();

let dbConnected = false;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    dbConnected = true;
    ensureGlobalChat();
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err.message);
    console.log("Running in offline mode (messages will not persist)");
  });

async function ensureGlobalChat() {
  try {
    const globalChat = await Chat.findOne({ id: "global" });
    if (!globalChat) {
      const newChat = new Chat({
        id: "global",
        name: "Secure Global Chat",
        participants: [],
        lastMsg: "Welcome to the secure chat!",
        time: "12:00 PM"
      });
      await newChat.save();
      console.log("Global Chat Created");
    }
  } catch (e) {
    console.log("Error ensuring global chat: ", e.message);
  }
}


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

  socket.emit("server_status", { dbConnected });
  
  if (dbConnected) {
    try {
      // Send global chat history on connection
      const globalHistory = await Message.find({ chatId: "global" }).sort({ createdAt: 1 });
      socket.emit("load_messages", { chatId: "global", messages: globalHistory });
    } catch (e) {
      console.log("Error loading global messages: ", e.message);
    }
  }

  socket.on("get_messages", async (chatId) => {
    if (dbConnected) {
      try {
        const chatHistory = await Message.find({ chatId }).sort({ createdAt: 1 });
        socket.emit("load_messages", { chatId, messages: chatHistory });
      } catch (e) {
        console.log("Error fetching chat history: ", e.message);
      }
    }
  });

  socket.on("get_chats", async (username) => {
    if (dbConnected) {
      try {
        // Fetch chats where the user is a participant OR the "global" chat
        const userChats = await Chat.find({
          $or: [
            { participants: username },
            { id: "global" }
          ]
        }) || [];
        socket.emit("load_chats", userChats);
      } catch (e) {
        console.log("Error fetching chats: ", e.message);
      }
    }
  });

  socket.on("get_user_data", async (username) => {
    if (dbConnected) {
      try {
        let user = await User.findOne({ username });
        if (!user) {
          // Create new user on first login
          user = new User({ username });
          await user.save();
        }
        socket.emit("load_user_data", user);
        // Map socket id to username for real-time signaling
        socket.join(username); 
      } catch (e) {
        console.log("Error fetching user data: ", e.message);
      }
    }
  });

  socket.on("search_users", async (query) => {
    if (dbConnected) {
      try {
        const users = await User.find({ username: { $regex: query, $options: "i" } }).limit(5);
        socket.emit("search_results", users.map(u => u.username));
      } catch (e) {
        console.log("Error searching users: ", e.message);
      }
    }
  });

  socket.on("create_chat", async (chatData) => {
    if (dbConnected) {
      try {
        const existingChat = await Chat.findOne({ id: chatData.id });
        if (!existingChat) {
          const newChat = new Chat(chatData);
          await newChat.save();
        }
        // Notify all participants
        if (chatData && Array.isArray(chatData.participants)) {
          chatData.participants.forEach(p => {
            io.to(p).emit("new_chat_available", chatData);
          });
        }
      } catch (e) {
        console.log("Error creating chat: ", e.message);
      }
    }
  });

  socket.on("initiate_call", (data) => {
    // data: { from, to, type }
    io.to(data.to).emit("incoming_call", data);
  });

  socket.on("respond_call", (data) => {
    // data: { from, to, accepted }
    io.to(data.to).emit("call_response", data);
  });

  socket.on("update_settings", async (data) => {
    if (dbConnected) {
      try {
        await User.findOneAndUpdate(
          { username: data.username },
          { settings: data.settings }
        );
      } catch (e) {
        console.log("Error updating settings: ", e.message);
      }
    }
  });

  socket.on("update_profile", async (data) => {
    if (dbConnected) {
      try {
        await User.findOneAndUpdate(
          { username: data.username },
          { status: data.status }
        );
      } catch (e) {
        console.log("Error updating profile: ", e.message);
      }
    }
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.broadcast.emit("user_stop_typing", data);
  });

  socket.on("send_message", async (data) => {
    if (dbConnected) {
      try {
        const newMessage = new Message({
          username: data.username,
          text: data.text,
          chatId: data.chatId || "global",
        });
        await newMessage.save();
      } catch (e) {
        console.log("Error saving message: ", e.message);
      }
    }

    socket.broadcast.emit("receive_message", data);
  });


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