const express = require('express')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const twilio = require('twilio')

const PORT = process.env.PORT || 5002;


const app = express();

const server = http.createServer(app)

app.use(cors())

let connectedUsers = []
let rooms = []

app.get('/api/room-exists/:roomId', (req, res) => {
    const { roomId } = req.params

    const room = rooms.find(room => room.id === roomId)

    if (room) {
        if (room.connectedUsers.length > 3) {
            res.send({ roomExists: true, full: true })
        } else {
            res.send({ roomExists: true, full: false })     
        }
    } else {
        res.send({ roomExists: false })
    }
})


const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


// for connecting socket
io.on('connection', (socket) => {
    console.log('user connected', socket.id)

    socket.on('create-new-room', (data) => {
        createNewRoomHandler(data, socket)
    })

    socket.on('join-room', (data) => {
        joinRoomHandler(data, socket)
    })
})




// for host create new room
const createNewRoomHandler = (data, socket) => {
    console.log('host is creating new room')
    console.log(data)
    const { identity } = data 
    const roomId = uuidv4()
    const newUser = {
        identity,
        id: uuidv4(),
        socket: socket.id,
        roomId: roomId
    }
    connectedUsers = [...connectedUsers, newUser]
    const newRoom = {
        id: roomId,
        connectedUsers: [newUser]
    }
    socket.join(roomId)
    rooms = [...rooms, newRoom]
    socket.emit("room-id", { roomId });
    socket.emit("room-update", {connectedUsers: newRoom.connectedUsers})                
}


const joinRoomHandler = (data, socket) => {
    const { identity, roomId } = data

    const newUser = {
        identity,
        id: uuidv4(),
        socket: socket.id,
        roomId: roomId
    }

    const room = rooms.find(room => room.id === roomId)

    room.connectedUsers = [...room.connectedUsers, newUser]

    socket.join(roomId)

    connectedUsers = [...connectedUsers, newUser]

    io.to(roomId).emit('room-update',{connectedUsers : room.connectedUsers})
}

server.listen(PORT, () => {
    console.log('Server listen is listening on ', PORT)
})