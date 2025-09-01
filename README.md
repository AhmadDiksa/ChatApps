# Chat App

Aplikasi chat real-time yang memungkinkan pengguna untuk berkomunikasi dalam room tertentu dengan fitur autentikasi, daftar pengguna online, dan indikator mengetik.

## Fitur Utama

- **Autentikasi Pengguna**: Registrasi dan login dengan JWT
- **Chat Real-Time**: Menggunakan Socket.io untuk komunikasi instan
- **Room Chat**: Pengguna dapat bergabung ke room tertentu
- **Daftar Pengguna Online**: Melihat siapa yang sedang online di room
- **Indikator Mengetik**: Menampilkan kapan pengguna sedang mengetik
- **Riwayat Pesan**: Pesan disimpan di database MongoDB
- **Responsive UI**: Antarmuka yang responsif menggunakan React

## Teknologi yang Digunakan

### Backend (chat-app-api)
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.io** - Library untuk real-time communication
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM untuk MongoDB
- **JWT** - JSON Web Tokens untuk autentikasi
- **bcryptjs** - Hashing password
- **Jest** - Testing framework

### Frontend (chat-app-client)
- **React** - Library JavaScript untuk UI
- **Vite** - Build tool dan dev server
- **React Router** - Routing untuk SPA
- **Socket.io-client** - Client untuk Socket.io
- **ESLint** - Linting tool

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda memiliki:
- **Node.js** (versi 16 atau lebih baru)
- **MongoDB** (lokal atau MongoDB Atlas)
- **npm** atau **yarn**

## Instalasi

1. **Clone repository ini:**
   ```bash
   git clone <url-repository>
   cd ChatApps
   ```

2. **Install dependencies untuk backend:**
   ```bash
   cd chat-app-api
   npm install
   ```

3. **Install dependencies untuk frontend:**
   ```bash
   cd ../chat-app-client
   npm install
   ```

## Konfigurasi

1. **Buat file `.env` di folder `chat-app-api`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/chatapp
   # Atau untuk MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatapp

   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

2. **Pastikan MongoDB berjalan** (jika menggunakan lokal):
   ```bash
   mongod
   ```

## Menjalankan Aplikasi

1. **Jalankan backend (API server):**
   ```bash
   cd chat-app-api
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5000`

2. **Jalankan frontend (dalam terminal baru):**
   ```bash
   cd chat-app-client
   npm run dev
   ```
   Aplikasi akan terbuka di `http://localhost:5173`

3. **Buka browser** dan navigasi ke `http://localhost:5173`

## API Endpoints

### Autentikasi
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna

### Chat
- `GET /api/chat/:roomName/messages` - Mendapatkan riwayat pesan dari room tertentu

## Struktur Proyek

```
ChatApps/
├── chat-app-api/          # Backend API
│   ├── models/            # Model MongoDB
│   ├── routes/            # API routes
│   ├── __tests__/         # Unit tests
│   ├── server.js          # Entry point server
│   └── package.json
├── chat-app-client/       # Frontend React
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Halaman aplikasi
│   │   ├── context/       # React context
│   │   └── App.jsx        # Main App component
│   ├── index.html
│   └── package.json
└── README.md              # File ini
```

## Testing

Untuk menjalankan test backend:
```bash
cd chat-app-api
npm test
```

## Deployment

### Backend
- Deploy ke platform seperti Heroku, Railway, atau VPS
- Pastikan environment variables diset dengan benar
- Gunakan PM2 untuk production

### Frontend
- Build aplikasi:
  ```bash
  cd chat-app-client
  npm run build
  ```
- Deploy ke Netlify, Vercel, atau hosting statis lainnya

## Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini menggunakan lisensi ISC.

## Kontak

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.
