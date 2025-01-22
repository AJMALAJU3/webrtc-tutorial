import { setShowOverlay } from "../store/actions";
import * as wss from "./wss"

import store from "../store/store"
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

const showLocalVideoPreview = (stream) => {

}