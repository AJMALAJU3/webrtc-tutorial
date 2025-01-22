import React, { useState } from 'react'
import JoinRoomInputs from './JoinRoomInputs'
import { connect } from 'react-redux'
import OnlyAudioCheckBox from "./OnlyAudioCheckBox"
import { setConnectOnlyWithAudio, setIdentity, setRoomId } from '../store/actions'
import ErrorMessage from './ErrorMessage'
import JoinRoomButtons from './JoinRoomButtons'
import { getRoomExists } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const JoinRoomContent = (props) => {
    const { isRoomHost, setConnectOnlyWithAudio, connectOnlyWithAudio, setIdentityAction, setRoomIdAction } = props
    const [roomIdValue, setRoomIdValue] = useState('')
    const [nameValue, setNameValue] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const navigate = useNavigate()

    const handleJoinRoom = async () => {
        setIdentityAction(nameValue)
        if (isRoomHost) {
            createRoom()
        } else {
            await joinRoom()
        }
    }

    const joinRoom = async () => {
        const responseMessage = await getRoomExists(roomIdValue)
        const { roomExists, full } = responseMessage;
        if (roomExists) {
            if (full) {
                setErrorMessage('Meeting is full, Please try again later')
            } else {
                setRoomIdAction(roomIdValue)
                navigate('/room')
            }
        } else {
            setErrorMessage('Meeting not found, Check your meeting ID')
        }
    } 

    const createRoom = () => {
        navigate('/room')
    }
  return (
    <>
    <JoinRoomInputs 
     roomIdValue={roomIdValue}
     setRoomIdValue={setRoomIdValue}
     nameValue={nameValue}
     setNameValue={setNameValue}
     isRoomHost={isRoomHost}
    />
    <OnlyAudioCheckBox setConnectOnlyWithAudio={setConnectOnlyWithAudio} connectOnlyWithAudio={connectOnlyWithAudio}/>

    <ErrorMessage errorMessage={errorMessage} />

    <JoinRoomButtons isRoomHost={isRoomHost} handleJoinRoom={handleJoinRoom}/> 
    </>
  )
}

const mapStateToProps = (state) => {
    return {
        ...state
    }
}

const mapActionsToProps = (dispatch) => {
    return {
        setConnectOnlyWithAudio: (onlyWithAudio) => dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
        setIdentityAction: (identity) => dispatch(setIdentity(identity)),
        setRoomIdAction: (roomId) => dispatch(setRoomId(roomId))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(JoinRoomContent)
