import React from 'react'
import './RoomPage.css'
import ParticipantsSection from './ParticipantsSection/ParticipantsSection'
import VideoSection from './VideoSection.js/VideoSection'
import ChatSection from './ChatSection/ChatSection'
import RoomLabel from './RoomLabel'
import { connect } from 'react-redux'

const RoomPage = () => {
  return (
    <div className='room_container'>
      <ParticipantsSection />
      <VideoSection />
      <ChatSection />
      <RoomLabel roomId={'1233'}/>
    </div>
  )
}

const mapStoreStateToProps = (state) => {
    return {
        ...state
    }
}


export default connect( mapStoreStateToProps)(RoomPage)
