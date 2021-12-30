const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors({
  origin: '*'
}))

app.get('/', function (req, res) {
  res.send('test');
});

const attenders = {

}


io.on("connection", (socket) => {
  
  socket.on('joinSocket', data => {
    const { userId } = data;
    attenders[userId] = socket.id;
    socket.join(userId);
  })

  socket.on('calling', ({ from, to }) => {
    console.log('calling');
    const socketId = attenders[to];
    io.to(socketId).emit('calling', from);
  });

  socket.on('cancelCalling', ({ to }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('cancelCalling', to);
  })

  socket.on('rejectCall', ({ to }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('rejectCall', to);
  })

  socket.on('acceptCall', ({ to }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('acceptCall', to);
  })

  socket.on('endCall', ({ to }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('endCall', to);
  })

  socket.on('onOffCamera', ({ to, status }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('onOffCamera', status);
  });
  
  socket.on('turnOnCamera', ({ to, desc }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('turnOnCamera', desc);
  });

  socket.on('turnOffMicro', ({to}) => {
    const socketId = attenders[to];
    io.to(socketId).emit('turnOffMicro', to);
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.on('offer', ({ to, desc }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('offer', desc);
  });

  socket.on('answer', ({ to, desc }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('answer', desc);
  })

  socket.on('candidate', ({ to, candidate }) => {
    const socketId = attenders[to];
    io.to(socketId).emit('candidate', candidate);
  })
});

httpServer.listen(3001);
