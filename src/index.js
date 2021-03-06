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

  console.log('new connection', socket.id);
  
  socket.on('joinSocket', data => {
    const { userId } = data;
    attenders[userId] = socket.id;
    socket.join(userId);
    console.log(attenders);
  })

  socket.on('calling', ({ from, to }) => {
    console.log('calling', from, to);
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
    console.log('offer: ', to , desc);
    const socketId = attenders[to];
    io.to(socketId).emit('offer', desc);
  });

  socket.on('answer', ({ to, desc }) => {
    console.log('answer', desc)
    const socketId = attenders[to];
    io.to(socketId).emit('answer', desc);
  })

  socket.on('candidate', ({ to, candidate }) => {
    console.log('candidate', candidate)
    const socketId = attenders[to];
    io.to(socketId).emit('candidate', candidate);
  })
});

httpServer.listen(3001);
