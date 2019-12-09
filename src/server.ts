import http from 'http';
import app from './app';
import socketIo from 'socket.io';
import jwt from 'jsonwebtoken';

const port = 9000;

const server = http.createServer(app);

server.listen(port);

const io = socketIo(server);

const connectedUsers: Map<number, string> = new Map<number, string>();

io.use((socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const userId = socket.handshake.query.userId;
        if (!userId) {
            socket.disconnect();
        }

        jwt.verify(token, process.env.SECRET);

        next();
    } catch (error) {
        socket.disconnect();
    }
});

io.on('connection', (socket) => {
    const socketId = socket.id;
    const userId = socket.handshake.query.userId;

    connectedUsers.set(userId, socketId);

    socket.on('msg', (event: IMessage) => {
        const msg: ISocketMessage = { status: 200, message: 'Sending message', payload: event };

        io.to(connectedUsers.get(event.to)).emit('msg', msg);
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(userId);
    });
});

interface IMessage {
    from: number;
    to: number;
    msg: string;
}

interface ISocketMessage {
    status: number;
    message: string;
    payload?: any;
}
