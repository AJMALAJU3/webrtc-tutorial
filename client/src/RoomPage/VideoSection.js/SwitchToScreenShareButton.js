import React, { useState } from 'react'
import SwitchImg from '../../resources/images/switchToScreenSharing.svg'

const SwitchToScreenShareButton = () => {
    const [isScreenSharingActive, setIsScreenSharigActive] = useState(false)

    const handleScreenShareToggle = () => {
        setIsScreenSharigActive(!isScreenSharingActive)
    }
  return (
    <div className='video_button_container'>
      <img src={SwitchImg} onClick={handleScreenShareToggle} className="video_button_image" />
    </div>
  )
}

export default SwitchToScreenShareButton
