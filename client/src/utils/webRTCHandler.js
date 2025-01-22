import { setShowOverlay } from "../store/actions";
import * as wss from "./wss"
import store from "../store/store"
import Peer from 'simple-peer'

const defaultContraints = {
    audio: true,
    video: true
}

let localStream;

export const getLocalPreviewAndInitRoomConnection = async (
    isRoomHost,
    identity,
    roomId = null
) => {
    navigator.mediaDevices.getUserMedia(defaultContraints).then(stream => {
        console.log('successfully recieved local stream')
        localStream = stream;
        showLocalVideoPreview(localStream)

        store.dispatch(setShowOverlay(false))
        console.log(isRoomHost,'is')
        isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(identity, roomId)
    }).catch((error) => {
        console.log('error occured while trying to get access to local stream',error)
    })
}


let peers = {}
let streams = []

const getConfiguration = () => {
    return {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            },
            { urls: 'stun:stun1.l.google.com:19302' },
        ]
    }
}

export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
    const configuration = getConfiguration()
    
    peers[connUserSocketId] = new Peer({
        initiator: isInitiator,
        config: configuration,
        stream: localStream
    })
    
    peers[connUserSocketId].on('signal', (data)=> {
        const signalData = {
            signal: data,
            connUserSocketId: connUserSocketId
        }
        
        wss.signalPeerData(signalData)
    })
    
    peers[connUserSocketId].on('stream', (stream) => {
        console.log('new stream came')
        addStream(stream, connUserSocketId);
        streams = [...streams, stream]
    })
}

export const handleSignalData = (data) => {
    peers[data.connUserSocketId].signal(data.signal)
}





//////////////// UI VIDEOS \\\\\\\\\\\\\\\\\\\\
const showLocalVideoPreview = (stream) => {
    const videosContainer = document.getElementById('videos_portal')
    videosContainer.classList.add("videos_portal_styles")
    const videoContainer = document.createElement('div')
    videoContainer.classList.add('video_track_container')
    const videoElement = document.createElement('video')
    videoElement.autoplay = true
    videoElement.muted = true
    videoElement.srcObject = stream
    
    videoElement.onloadedmetadata = () => {
        videoElement.play()
    }
    
    videoContainer.appendChild(videoElement)
    videosContainer.appendChild(videoContainer)
}

const addStream = (stream, connUserSocketId) => {
    const videosContainer = document.getElementById('videos_portal')
    const videoContainer = document.createElement('div')
    videoContainer.id = connUserSocketId;

    videoContainer.classList.add('video_track_container')
    const videoElement = document.createElement('video')
    videoElement.autoplay = true
    videoElement.srcObject = stream
    videoElement.id = `${connUserSocketId}-video`
    
    videoElement.onloadedmetadata = () => {
        videoElement.play()
    }

    videoContainer.appendChild(videoElement)
    videosContainer.appendChild(videoContainer)
}