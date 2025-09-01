import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

const SOCKET_URL = 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (authToken) {
            const newSocket = io(SOCKET_URL, {
                auth: {
                    token: authToken,
                },
            });

            setSocket(newSocket);

            // Bersihkan koneksi saat komponen di-unmount
            return () => newSocket.close();
        }
    }, [authToken]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};