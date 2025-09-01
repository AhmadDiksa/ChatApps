import React from 'react';
import './UserList.css';

const UserList = ({ users }) => {
    const username = localStorage.getItem('username');
    
    return (
        <div className="user-list-container">
            <h3 className="user-list-header">ONLINE—{users.length}</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id} className="user-list-item">
                        <div className="user-avatar"></div>
                        <span>{user.username} {user.username === username ? '(You)' : ''}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;