import io from 'socket.io-client';
import store from '../store/store';
import { setParticipants, setRoomId } from '../store/actions';
import * as webRTCHandler from './webRTCHandler';

const SERVER = 'http://localhost:5002';

let socket = null;

// Function to establish socket connection
export const connectWithSocketIOServer = () => {
    socket = io(SERVER);

    socket.on('connect', () => {
        console.log(`Connected to socket.io server with ID: ${socket.id}`);
    });

    socket.on('room-id', ({ roomId }) => {
        store.dispatch(setRoomId(roomId));
    });

    socket.on('room-update', ({ connectedUsers }) => {
        store.dispatch(setParticipants(connectedUsers));
    });

    socket.on('conn-prepare', ({ connUserSocketId }) => {
        console.log('Preparing new peer connection...');
        webRTCHandler.prepareNewPeerConnection(connUserSocketId, false);

        // Inform the peer to initialize the connection
        socket.emit('conn-init', { connUserSocketId });
    });

    socket.on('conn-signal', (data) => {
        webRTCHandler.handleSignalData(data);
    });

    socket.on('conn-init', ({ connUserSocketId }) => {
        webRTCHandler.prepareNewPeerConnection(connUserSocketId, true);
    });

    socket.on('disconnect', () => {
        console.warn('Disconnected from socket.io server');
    });

    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
    });
};

// Function to create a new room
export const createNewRoom = (identity) => {
    if (!socket) {
        console.error('Socket not initialized. Cannot create room.');
        return;
    }

    console.log('Creating a new room...');
    socket.emit('create-new-room', { identity });
};

// Function to join an existing room
export const joinRoom = (identity, roomId) => {
    if (!socket) {
        console.error('Socket not initialized. Cannot join room.');
        return;
    }

    console.log(`Joining room: ${roomId} with identity: ${identity}`);
    socket.emit('join-room', { identity, roomId });
};

// Function to send signaling data to peers
export const signalPeerData = (data) => {
    if (!socket) {
        console.error('Socket not initialized. Cannot send signal data.');
        return;
    }

    console.log('Sending signaling data to peer...');
    socket.emit('conn-signal', data);
};
