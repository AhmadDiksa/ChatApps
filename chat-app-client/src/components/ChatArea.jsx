import React from 'react';
import Message from './Message'; // Komponen baru untuk satu pesan
import MessageInput from './MessageInput';
import './ChatArea.css';

const ChatArea = ({ currentRoom, messages, typingUsers, onSendMessage, onTyping }) => {
    return (
        <div className="chat-area-container">
            <div className="chat-header">
                <span className="header-hash">#</span>
                <span className="header-title">{currentRoom}</span>
            </div>
            <div className="messages-list">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
                 <div className="typing-indicator">
                    {Object.keys(typingUsers).length > 0 && 
                        `${Object.keys(typingUsers).join(', ')} sedang mengetik...`
                    }
                </div>
            </div>
            <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
        </div>
    );
};

export default ChatArea;