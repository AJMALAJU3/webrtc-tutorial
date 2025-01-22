import React, { useState } from 'react'
import CameraButtonImg from '../../resources/images/camera.svg'
import CameraButtonOff from '../../resources/images/cameraOff.svg'

const CameraButton = (props) => {
    const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false)

    const handleCameraButtonPressed = () => {
        setIsLocalVideoDisabled(!isLocalVideoDisabled)
    }
  return (
    <div className='video_button_container'>
      <img 
      src={isLocalVideoDisabled ? CameraButtonOff : CameraButtonImg}
      onClick={handleCameraButtonPressed} 
      className='video_button_image'/>
    </div>
  )
}

export default CameraButton
