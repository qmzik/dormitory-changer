import http from 'http';
import app from './app';
import socketIo from 'socket.io';


const port = 8000;

const server = http.createServer(app);

server.listen(port);

export default server;

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('connected');
});
