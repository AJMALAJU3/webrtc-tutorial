const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 5002;
const app = express();
const server = http.createServer(app);

// Fix CORS to allow requests from your frontend domain
app.use(cors({
  origin: ['https://webrtc-tutorial-mauve.vercel.app', 'https://webrtc-trial.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));


let connectedUsers = [];
let rooms = [];

// Check if a room exists
app.get('/api/room-exists/:roomId', (req, res) => {
    const { roomId } = req.params;
    const room = rooms.find(room => room.id === roomId);

    if (room) {
        res.send({ roomExists: true, full: room.connectedUsers.length > 3 });
    } else {
        res.send({ roomExists: false });
    }
});

const io = socketIO(server, {
  cors: {
    origin: 'https://webrtc-trial.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Allow fallback to polling
});


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create-new-room', (data) => createNewRoomHandler(data, socket));
    socket.on('join-room', (data) => joinRoomHandler(data, socket));
    socket.on('disconnect', () => disconnectHandler(socket));
    socket.on('conn-signal', (data) => signalingHandler(data, socket));
    socket.on('conn-init', (data) => initializeConnectionHandler(data, socket));
});

const createNewRoomHandler = (data, socket) => {
    console.log('Creating new room:', data.identity);
    const roomId = uuidv4();

    const newUser = {
        identity: data.identity,
        id: uuidv4(),
        socketId: socket.id,
        roomId
    };

    connectedUsers.push(newUser);
    rooms.push({ id: roomId, connectedUsers: [newUser] });

    socket.join(roomId);
    socket.emit('room-id', { roomId });
    socket.emit('room-update', { connectedUsers: [newUser] });
};

const joinRoomHandler = (data, socket) => {
    const { identity, roomId } = data;
    const room = rooms.find(room => room.id === roomId);

    if (room) {
        const newUser = {
            identity,
            id: uuidv4(),
            socketId: socket.id,
            roomId
        };
        
        room.connectedUsers.push(newUser);
        connectedUsers.push(newUser);

        socket.join(roomId);
        console.log('User joined room:', roomId);

        room.connectedUsers.forEach(user => {
            if (user.socketId !== socket.id) {
                io.to(user.socketId).emit('conn-prepare', { connUserSocketId: socket.id });
            }
        });

        io.to(roomId).emit('room-update', { connectedUsers: room.connectedUsers });
    }
};

const disconnectHandler = (socket) => {
    const user = connectedUsers.find(user => user.socketId === socket.id);

    if (user) {
        const room = rooms.find(room => room.id === user.roomId);

        if (room) {
            room.connectedUsers = room.connectedUsers.filter(u => u.socketId !== socket.id);
            socket.leave(user.roomId);

            if (room.connectedUsers.length > 0) {
                io.to(room.id).emit('room-update', { connectedUsers: room.connectedUsers });
            } else {
                rooms = rooms.filter(r => r.id !== room.id);
            }
        }

        connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);
    }
};

const signalingHandler = (data, socket) => {
    const { connUserSocketId, signal } = data;
    io.to(connUserSocketId).emit('conn-signal', { signal, connUserSocketId: socket.id });
};

const initializeConnectionHandler = (data, socket) => {
    io.to(data.connUserSocketId).emit('conn-init', { connUserSocketId: socket.id });
};

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
