import React from 'react';
import './Message.css';

const Message = ({ message }) => {
    if (message.isNotification) {
        return <div className="notification">{message.message}</div>;
    }

    const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="message-container">
            <div className="message-avatar"></div>
            <div className="message-body">
                <div className="message-header">
                    <span className="message-author">{message.author}</span>
                    <span className="message-timestamp">{timestamp}</span>
                </div>
                <div className="message-content">{message.message}</div>
            </div>
        </div>
    );
};

export default Message;