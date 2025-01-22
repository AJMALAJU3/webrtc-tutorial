import React from 'react'
import { useNavigate } from 'react-router-dom'

const Button = ({ buttonText, cancelButton = false, onClickHandler }) => {
    const buttonClass = cancelButton ? 'join_room_cancel_button' : 'join_room_success_button'

    return (
        <button className={buttonClass} onClick={onClickHandler}>{buttonText}</button>
    )
}

const JoinRoomButtons = ({ handleJoinRoom, isRoomHost }) => {
    const successButtonText = isRoomHost ? 'Host' : 'Join'
    const navigate = useNavigate()

    const pushToIntroductionPage = () => {
        navigate('/')
    }
  return (
    <div className='join_room_buttons_container'>
      <Button buttonText={successButtonText} cancelButton onClickHandler={handleJoinRoom}/>
      <Button buttonText='Cancel' cancelButton onClickHandler={pushToIntroductionPage}/>
    </div>
  )
}

export default JoinRoomButtons
