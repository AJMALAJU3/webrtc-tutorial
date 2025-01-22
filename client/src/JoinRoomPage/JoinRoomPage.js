import React, { useEffect } from 'react';
import './JoinRoomPage.css';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { setIsRoomHost } from '../store/actions';
import JoinRoomTitle from './JoinRoomTitle';
import JoinRoomContent from './JoinRoomContent';

const JoinRoomPage = ({ setIsRoomHostAction, isRoomHost }) => {
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const isRoomHost = queryParams.get('host') === 'true';
        setIsRoomHostAction(isRoomHost);
    }, [location.search, setIsRoomHostAction]);

    return (
        <div className="join_room_page_container">
            <div className="join_room_page_panel">
                <JoinRoomTitle isRoomHost={isRoomHost}/>
                <JoinRoomContent />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoomPage);
