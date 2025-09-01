import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

import ChannelList from '../components/ChannelList';
import ChatArea from '../components/ChatArea';
import UserList from '../components/UserList';

import './ChatPage.css'; // File CSS baru untuk layout utama

const ChatPage = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    
    // State dan logika inti tetap sama!
    const [currentRoom, setCurrentRoom] = useState('general');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState({});

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (!socket) return;

        const joinAndLoad = (roomName) => {
            socket.emit('join_room', roomName);
            fetch(`http://localhost:5000/api/chat/${roomName}/messages`)
                .then(res => res.json())
                .then(data => setMessages(data))
                .catch(err => console.error("Gagal memuat riwayat chat:", err));
        };

        joinAndLoad(currentRoom);

        const handleNotification = (data) => {
            const notification = { ...data, isNotification: true };
            setMessages((prevMessages) => [...prevMessages, notification]);
        };

        socket.on('receive_message', (newMessage) => setMessages((prev) => [...prev, newMessage]));
        socket.on('user_joined', handleNotification);
        socket.on('user_left', handleNotification);
        socket.on('update_user_list', (userList) => setUsers(userList));
        socket.on('user_typing', ({ username, isTyping }) => {
            setTypingUsers(prev => {
                const newTypingUsers = { ...prev };
                if (isTyping) newTypingUsers[username] = true;
                else delete newTypingUsers[username];
                return newTypingUsers;
            });
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_joined', handleNotification);
            socket.off('user_left', handleNotification);
            socket.off('update_user_list');
            socket.off('user_typing');
        };
    }, [socket, currentRoom]);

    const handleRoomChange = (newRoom) => {
        if (newRoom !== currentRoom) {
            setMessages([]);
            setCurrentRoom(newRoom);
        }
    };

    const handleSendMessage = (message) => {
        if (socket && message.trim()) {
            socket.emit('send_message', { room: currentRoom, message });
        }
    };

    const handleTyping = (isTyping) => {
        socket.emit('typing', { room: currentRoom, isTyping });
    };

    return (
        <div className="discord-layout">
            <ChannelList 
                currentRoom={currentRoom}
                onRoomChange={handleRoomChange}
            />
            <ChatArea 
                currentRoom={currentRoom}
                messages={messages}
                typingUsers={typingUsers}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
            />
            <UserList users={users} />
        </div>
    );
};

export default ChatPage;