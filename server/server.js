const express = require('express')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const twilio = require('twilio')

const PORT = process.env.PORT || 5002;


const app = express();

const server = http.createServer(app)

app.use(cors())

let connectUsers = []
let rooms = []

app.get('/api/room-exists/:roomId', (req, res) => {
    const { roomId } = req.params

    const room = rooms.find(room => room.id === roomId)

    if (room) {
        if (room.connectUsers.length > 3) {
            res.send({ roomExists: false, full: true })
        } else {
            res.send({ roomExists: false, full: false })     
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

server.listen(PORT, () => {
    console.log('Server listen is listening on ', PORT)
})