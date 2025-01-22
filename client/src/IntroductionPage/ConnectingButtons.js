import React from 'react'
import ConnectingButton from './ConnectingButton'
import { useNavigate } from 'react-router-dom'

const ConnectingButtons = () => {
    const navigate = useNavigate()
    const pushJoinRoomPage = () => {
        navigate('/join-room')
    }
    const pushJoinRoomPageAsHost = () => {
        navigate('/join-room?host=true')
    }

  return (
    <div className='connecting_buttons_container'>
      <ConnectingButton buttonText='join a meeting' onClickHandler={pushJoinRoomPage}/>
      <ConnectingButton createRoomButton={true} buttonText='host a meeting' onClickHandler={pushJoinRoomPageAsHost}/>
    </div>
  )
}

export default ConnectingButtons
