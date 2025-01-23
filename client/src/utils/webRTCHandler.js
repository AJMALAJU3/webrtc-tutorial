import { setShowOverlay } from "../store/actions";
import * as wss from "./wss";
import store from "../store/store";
import Peer from "simple-peer";

const defaultConstraints = {
    audio: true,
    video: true
};

let localStream;
let peers = {};
let streams = [];

// Function to initialize local media and connect to room
export const getLocalPreviewAndInitRoomConnection = async (isRoomHost, identity, roomId = null) => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
        console.log("Successfully received local stream");

        showLocalVideoPreview(localStream);
        store.dispatch(setShowOverlay(false));

        if (isRoomHost) {
            wss.createNewRoom(identity);
        } else {
            wss.joinRoom(identity, roomId);
        }
    } catch (error) {
        console.error("Error accessing local stream:", error);
    }
};

// ICE server configuration for peer connections
const getConfiguration = () => ({
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
});

// Function to prepare a new peer connection
export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
    const configuration = getConfiguration();

    const peer = new Peer({
        initiator: isInitiator,
        config: configuration,
        stream: localStream
    });

    peers[connUserSocketId] = peer;

    peer.on("signal", (signal) => {
        console.log("Sending signal to peer:", connUserSocketId);
        wss.signalPeerData({ signal, connUserSocketId });
    });

    peer.on("stream", (stream) => {
        console.log("Received new stream from peer:", connUserSocketId);
        addStream(stream, connUserSocketId);
        streams = [...streams, stream];
    });

    peer.on("error", (err) => {
        console.error(`Peer connection error (${connUserSocketId}):`, err);
    });

    peer.on("close", () => {
        console.log(`Connection closed for peer: ${connUserSocketId}`);
        removeStream(connUserSocketId);
    });
};

// Function to handle incoming signal data
export const handleSignalData = (data) => {
    const { connUserSocketId, signal } = data;
    if (peers[connUserSocketId]) {
        peers[connUserSocketId].signal(signal);
    } else {
        console.warn(`Peer connection not found for: ${connUserSocketId}`);
    }
};

///////////////////// UI VIDEO FUNCTIONS /////////////////////

// Show local video preview
const showLocalVideoPreview = (stream) => {
    const videosContainer = document.getElementById("videos_portal");
    videosContainer.classList.add("videos_portal_styles");

    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video_track_container");

    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.srcObject = stream;

    videoElement.onloadedmetadata = () => videoElement.play();

    videoContainer.appendChild(videoElement);
    videosContainer.appendChild(videoContainer);
};

// Add remote peer's video stream to UI
const addStream = (stream, connUserSocketId) => {
    console.log("Adding new peer video:", connUserSocketId);
    
    const videosContainer = document.getElementById("videos_portal");
    const videoContainer = document.createElement("div");
    videoContainer.id = connUserSocketId;
    videoContainer.classList.add("video_track_container");

    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.srcObject = stream;
    videoElement.id = `${connUserSocketId}-video`;

    videoElement.onloadedmetadata = () => videoElement.play();

    videoContainer.appendChild(videoElement);
    videosContainer.appendChild(videoContainer);
};

// Remove peer's video stream from UI when they disconnect
const removeStream = (connUserSocketId) => {
    console.log("Removing peer video:", connUserSocketId);
    
    const videoContainer = document.getElementById(connUserSocketId);
    if (videoContainer) {
        videoContainer.remove();
    }
};
