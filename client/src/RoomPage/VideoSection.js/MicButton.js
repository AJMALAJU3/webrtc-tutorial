import React, { useState } from 'react'
import micButtonImg from '../../resources/images/mic.svg'
import micButtonOff from '../../resources/images/micOff.svg'

const MicButton = (props) => {
    const [isMicMuted, setIsMicMuted] = useState(false)

    const handleMicButtonPressed = () => {
        setIsMicMuted(!isMicMuted)
    }
  return (
    <div className='video_button_container'>
      <img src={isMicMuted ? micButtonOff : micButtonImg }
      onClick={handleMicButtonPressed} className='video_button_image'/>
    </div>
  )
}

export default MicButton
