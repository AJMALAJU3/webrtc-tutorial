import React from 'react'

const JoinRoomTitle = ({ isRoomHost }) => {
    const titleText = isRoomHost ? 'host meeting' : 'join meeting' 
  return (
    <p className='join_room_title'>       
      {titleText}
    </p>
  )
}

export default JoinRoomTitle
