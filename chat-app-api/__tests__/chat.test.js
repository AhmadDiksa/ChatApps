import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Impor rute yang akan kita tes
import chatRoutes from '../routes/chatRoutes.js';

// Muat variabel lingkungan dari file .env
// Ini penting agar process.env.MONGO_URI tersedia untuk tes
dotenv.config();

// Setup aplikasi Express tiruan khusus untuk testing
const app = express();
app.use('/api/chat', chatRoutes);

/*
  --- PENGELOLAAN KONEKSI DATABASE UNTUK TES ---
*/

// Hook ini akan berjalan SATU KALI sebelum semua tes di file ini dimulai
beforeAll(async () => {
    // Pastikan kita punya MONGO_URI
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI harus didefinisikan di file .env');
    }
    // Buat koneksi ke database MongoDB
    await mongoose.connect(process.env.MONGO_URI);
});

// Hook ini akan berjalan SATU KALI setelah semua tes di file ini selesai
afterAll(async () => {
    // Tutup koneksi database
    // Ini sangat penting agar proses Jest bisa keluar dengan bersih
    await mongoose.connection.close();
});


/*
  --- TEST SUITE ---
*/
describe('GET /api/chat/:roomName/messages', () => {
    
    test('Seharusnya merespon dengan status code 200 untuk room yang ada', async () => {
        const response = await request(app).get('/api/chat/general/messages');
        expect(response.statusCode).toBe(200);
    });

    test('Seharusnya merespon dengan body berupa array', async () => {
        const response = await request(app).get('/api/chat/general/messages');
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Seharusnya merespon dengan header Content-Type application/json', async () => {
        const response = await request(app).get('/api/chat/general/messages');
        expect(response.headers['content-type']).toMatch(/application\/json/);
    });
});