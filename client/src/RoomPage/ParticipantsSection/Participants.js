import React from 'react'

const dummyParticipants = [
    {
        identity: 'ajmal',

    },
    {
        identity: 'jasir',

    },
    {
        identity: 'alen',

    },
    {
        identity: 'adwaith',

    },
]

const SingleParticipant = (props) => {
    const { identity, lastItem, participant } = props

    return (
        <>
            <p className='participants_paragraph'>{identity}</p>
            {!lastItem && <span className='participants_seperator_line'></span>}
        </>
    )
}

const Participants = () => {
    return (
        <div className='participants_container'>
            {dummyParticipants.map((participant, index) => {
                return (
                    <SingleParticipant key={participant.identity} identity={participant.identity} lastItem={dummyParticipants.length === index+1} participant={participant}/>
                )
            })}
        </div>
    )
}

export default Participants
