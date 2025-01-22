import React, { useEffect } from 'react'
import './RoomPage.css'
import ParticipantsSection from './ParticipantsSection/ParticipantsSection'
import VideoSection from './VideoSection.js/VideoSection'
import ChatSection from './ChatSection/ChatSection'
import RoomLabel from './RoomLabel'
import { connect } from 'react-redux'
import * as webRTCHandler from '../utils/webRTCHandler';
import Overlay from './Overlay'

const RoomPage = ({ roomId, identity, isRoomHost, showOverlay }) => {

    useEffect(() => {
        webRTCHandler.getLocalPreviewAndInitRoomConnection(
        isRoomHost,
        identity,
        roomId)
    },[])
  return (
    <div className='room_container'>
      <ParticipantsSection />
      <VideoSection />
      <ChatSection />
      <RoomLabel roomId={roomId}/>
      {showOverlay && <Overlay />}
    </div>
  )
}

const mapStoreStateToProps = (state) => {
    return {
        ...state
    }
}


export default connect( mapStoreStateToProps)(RoomPage)
