import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- Penting untuk frontend React
import jwt from 'jsonwebtoken';

// Impor Model
import User from './models/userModel.js';
import Message from './models/messageModel.js';

// Impor Rute
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Konfigurasi awal
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // <-- Sesuaikan dengan URL frontend Vite Anda
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors()); // <-- Izinkan Cross-Origin Resource Sharing
app.use(express.json());

// Koneksi ke Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
    .catch((error) => console.error('Koneksi MongoDB gagal:', error.message));

// Rute API
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Variabel untuk melacak state pengguna online di memori server
const usersInRooms = {};

// Middleware Autentikasi untuk Socket.IO
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: Token tidak ditemukan'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return next(new Error('Authentication error: Pengguna tidak ditemukan'));
        }
        socket.user = user;
        next();
    } catch (err) {
        return next(new Error('Authentication error: Token tidak valid'));
    }
});

// Logika Inti Socket.IO
io.on('connection', (socket) => {
    console.log(`User terhubung: ${socket.user.username} (${socket.id})`);

    socket.on('join_room', (roomName) => {
        // Keluar dari semua room sebelumnya untuk memastikan user hanya ada di satu room
        for (const room in socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
                if (usersInRooms[room]) {
                    usersInRooms[room] = usersInRooms[room].filter(u => u.id !== socket.id);
                    io.to(room).emit('update_user_list', usersInRooms[room]);
                }
            }
        }
        
        // Bergabung ke room baru
        socket.join(roomName);

        // Tambahkan pengguna ke daftar room
        if (!usersInRooms[roomName]) {
            usersInRooms[roomName] = [];
        }
        if (!usersInRooms[roomName].some(u => u.id === socket.id)) {
            usersInRooms[roomName].push({ id: socket.id, username: socket.user.username });
        }

        console.log(`User ${socket.user.username} bergabung ke room: ${roomName}`);

        // Kirim daftar pengguna yang diperbarui ke semua klien di room tersebut
        io.to(roomName).emit('update_user_list', usersInRooms[roomName]);

        // Kirim notifikasi HANYA ke klien lain bahwa user baru telah bergabung
        socket.to(roomName).emit('user_joined', {
            message: `${socket.user.username} telah bergabung.`
        });
    });

    socket.on('send_message', async (data) => {
        const messageData = {
            room: data.room,
            author: socket.user.username, // Ambil username dari socket yang terautentikasi
            message: data.message,
        };

        // Simpan pesan ke database
        const newMessage = new Message(messageData);
        await newMessage.save();

        // Kirim pesan ke semua klien di room yang sama
        io.to(data.room).emit('receive_message', messageData);
    });
    
    socket.on('typing', ({ room, isTyping }) => {
        // Broadcast ke semua orang di room KECUALI si pengirim
        socket.to(room).emit('user_typing', {
            username: socket.user.username,
            isTyping: isTyping
        });
    });

    socket.on('disconnect', () => {
        console.log(`User terputus: ${socket.user.username} (${socket.id})`);
        // Cari di semua room, di mana user ini berada, lalu hapus
        for (const roomName in usersInRooms) {
            const userIndex = usersInRooms[roomName].findIndex(u => u.id === socket.id);
            if (userIndex !== -1) {
                const disconnectedUser = usersInRooms[roomName].splice(userIndex, 1)[0];
                
                // Kirim daftar pengguna yang diperbarui ke sisa pengguna di room
                io.to(roomName).emit('update_user_list', usersInRooms[roomName]);
                
                // Kirim notifikasi bahwa seorang user telah keluar
                io.to(roomName).emit('user_left', {
                    message: `${disconnectedUser.username} telah keluar.`
                });
                break;
            }
        }
    });
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));