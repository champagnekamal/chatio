const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
const register = require('./routes/createUser')
const jwt = require('jsonwebtoken');
const login = require('./routes/login');
const getuser = require('./routes/getusers');
const verifyToken = require('./middleware/verifytoken');
const socketio = require('socket.io');
const app = express()
const server = require('http').Server(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = 5000

server.listen(6000, () => {
  console.log(`Server running on port 6000}`);
});
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
const uri = process.env.MONGODB_URI
console.log(uri);
// const client = new MongoClient(uri);
app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hi this is my first node app")
})



app.use('/user', register);
app.use('/user', login);
app.use('/user',verifyToken, getuser);


async function startServer() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  startServer();

