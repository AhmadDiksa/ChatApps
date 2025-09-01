import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './ChannelList.css';

const ChannelList = ({ currentRoom, onRoomChange }) => {
    const navigate = useNavigate();
    const socket = useSocket();
    const username = localStorage.getItem('username');
    const rooms = ['general', 'tech', 'random']; // Daftar room statis

    const handleLogout = () => {
        localStorage.clear();
        if (socket) socket.disconnect();
        navigate('/login');
    };

    return (
        <div className="channel-list-container">
            <div className="server-header">
                <h3>Chat Server</h3>
            </div>
            <div className="channels">
                <p className="channels-header">TEXT CHANNELS</p>
                <ul>
                    {rooms.map(room => (
                        <li 
                            key={room} 
                            className={currentRoom === room ? 'active' : ''}
                            onClick={() => onRoomChange(room)}
                        >
                            <span className="channel-hash">#</span> {room}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="user-panel">
                <div className="user-avatar"></div>
                <span>{username}</span>
                <button onClick={handleLogout} className="logout-icon">🚪</button>
            </div>
        </div>
    );
};

export default ChannelList;