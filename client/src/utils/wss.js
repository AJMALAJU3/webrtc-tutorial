import io from 'socket.io-client'
import store from '../store/store'
import { setParticipants, setRoomId } from '../store/actions'
import * as webRTCHandler from './webRTCHandler'

const SERVER = 'http://localhost:5002'

let socket = null

export const connectWithSocketIOServer = () => {
    socket = io(SERVER)
    socket.on('connect', () => {
        console.log(socket.id)
        console.log('successfully connected with socket io server')
    })

    socket.on('room-id', (data) => {
        const {roomId} = data 
        store.dispatch(setRoomId(roomId))
    })

    socket.on('room-update', (data) => {
        const { connectedUsers } = data
        store.dispatch(setParticipants(connectedUsers))
    })

    socket.on('conn-prepare', (data) => {
        const { connUserSocketId } = data
        webRTCHandler.prepareNewPeerConnection(connUserSocketId, false)

        socket.emit('conn-init', { connUserSocketId:connUserSocketId })
    })

    socket.on('conn-signal', (data) => {
        webRTCHandler.handleSignalData(data) 
    })

    socket.on('conn-init', (data) => {
        const { connUserSocketId } = data;
        webRTCHandler.prepareNewPeerConnection(connUserSocketId, true)
    })
}

export const createNewRoom = (identity) => {
    const data = {
        identity
    }

    socket.emit('create-new-room', data)
}

export const joinRoom = (identity, roomId) => {
    const data = {
        roomId,
        identity
    }

    socket.emit("join-room",data)
}

export const signalPeerData = (data) => {
    socket.emit('conn-signal', data)
}