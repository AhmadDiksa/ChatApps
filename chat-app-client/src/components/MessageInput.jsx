import React, { useState } from 'react';
import './MessageInput.css'; // Impor file CSS

// Variabel untuk mengelola timeout 'berhenti mengetik'
let typingTimeout;
const TYPING_TIMER_LENGTH = 1500; // 1.5 detik

const MessageInput = ({ onSendMessage, onTyping }) => {
    // State untuk menyimpan isi dari input box
    const [message, setMessage] = useState('');

    // Fungsi ini dipanggil setiap kali pengguna mengetik di input box
    const handleInputChange = (e) => {
        setMessage(e.target.value);

        // Kirim event bahwa pengguna sedang mengetik
        onTyping(true);
        
        // Hapus timeout sebelumnya agar tidak prematur mengirim 'berhenti mengetik'
        clearTimeout(typingTimeout);

        // Set timeout baru. Jika tidak ada input lagi selama 1.5 detik,
        // kirim event bahwa pengguna telah berhenti mengetik.
        typingTimeout = setTimeout(() => {
            onTyping(false);
        }, TYPING_TIMER_LENGTH);
    };

    // Fungsi ini dipanggil saat form di-submit (pengguna menekan Enter)
    const handleSubmit = (e) => {
        e.preventDefault(); // Mencegah refresh halaman
        
        // Panggil fungsi onSendMessage yang di-pass dari ChatPage
        onSendMessage(message);

        // Kosongkan input box setelah pesan dikirim
        setMessage('');

        // Hentikan timer 'mengetik' dan langsung kirim event berhenti
        clearTimeout(typingTimeout);
        onTyping(false);
    };

    return (
        // Menggunakan <form> agar pengguna bisa mengirim pesan dengan menekan tombol Enter
        <form className="message-input-container" onSubmit={handleSubmit}>
            <div className="message-input-wrapper">
                {/* Di masa depan, Anda bisa menambahkan ikon '+' atau emoji di sini */}
                <input
                    type="text"
                    className="message-input"
                    placeholder="Ketik pesan..."
                    autoComplete="off"
                    value={message}
                    onChange={handleInputChange}
                />
            </div>
        </form>
    );
};

export default MessageInput;