const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const WS_PORT = process.env.PORT || 3000;


app.use(express.json());

const io = new Server(httpServer, {
    cors: {
      origin: ['https://web-stockeanding.herokuapp.com','https://api-stockeanding.herokuapp.com'],
      methods: ['GET', 'POST'],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  });

io.on("connection", (socket) => {
  socket.on('join room', (room) => {
    socket.join(room);
  });
});

app.io = io;

app.post("/send-msg-to-user", (req, res) =>{
    const {body, username} = req.body;
    const message = {
        body : body,
        date : new Date()
    }

    req.app.io.to(`user:${username}`).emit('notifications', message);

    return res.status(200).send();
});

httpServer.listen(WS_PORT, () => {
    console.log('listening on port 3000');
});