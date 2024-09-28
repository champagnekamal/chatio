const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const User = require("./model/user.js");
const Message = require("./model/messages.js");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 8080;

app.use(express.json());

// Middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});

const onlineUsers = {};
// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on('private-connection', async (data) => {
    console.log(data,"data")
    const { userId, userName } = data;
    const recipientSocketId = onlineUsers[userId];
console.log(recipientSocketId,"rjgr");
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit('private-message', {
        senderId: socket.id,
        message: `Hello, ${userName}!`,
      });
    } else {
      console.log(`User with ID ${userId} is not online`);
    }
  });

  socket.on('private-message', async (data) => {
    const { message, to, from } = data;
    const recipientSocketId = onlineUsers[to];
  console.log(message,"message")
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit('private-message', {
        message,
        senderId: from,
      });
    } else {
      console.log(`Recipient ${to} is offline`);
    }
  });

  socket.on('register', async (email) => {
    onlineUsers[email] = socket.id;
    console.log(`${email} registered with socket ID: ${socket.id}`);
  });

 
});

// Start server
server.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
  console.log(`Server started on port ${PORT}`);
});
