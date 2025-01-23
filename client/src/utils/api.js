import axios from 'axios'

const serverApi = 'https://webrtc-trial.vercel.app/api';

export const getRoomExists = async (roomId) => {
    const response = await axios.get(`${serverApi}/room-exists/${roomId}`)
    return response.data
}
