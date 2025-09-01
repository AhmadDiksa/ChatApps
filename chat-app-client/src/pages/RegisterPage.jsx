import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; // Impor file CSS bersama

const API_URL = 'http://localhost:5000/api/auth';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mendaftar');
            }
            setMessage('Registrasi berhasil! Mengarahkan ke halaman login...');
            setIsError(false);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Buat Akun Baru</h2>
                <p className="subtitle">Mulai petualangan chatting-mu!</p>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                    {message && (
                        <p className={`message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="switch-link">
                    Sudah punya akun? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;