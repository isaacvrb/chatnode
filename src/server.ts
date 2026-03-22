import express from 'express';
import path from 'path';
import http from 'http';
import { Server, DefaultEventsMap } from 'socket.io';

interface SocketData {
  userName: string;
}

const app = express();
const server = http.createServer(app);
const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

let connectedUsers: string[] = [];

io.on('connection', socket => {
  socket.on('join-request', (userName: string) => {
    socket.data.userName = userName;
    connectedUsers.push(userName);

    socket.emit('user-ok', connectedUsers);
    socket.broadcast.emit('list-update', {
      joined: userName,
      list: connectedUsers,
    });
  });

  socket.on('disconnect', () => {
    const userName = socket.data.userName;
    connectedUsers = connectedUsers.filter(user => user !== userName);

    socket.broadcast.emit('list-update', {
      left: userName,
      list: connectedUsers,
    });
  });

  socket.on('send-msg', (msg: string) => {
    const userName = socket.data.userName;
    const data = {
      userName,
      msg,
    };

    socket.broadcast.emit('show-msg', data);
  });
});
