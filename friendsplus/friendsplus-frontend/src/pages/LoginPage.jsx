import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { card, text, border, input, primaryGradient } = useContext(ThemeContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const userData = await res.json();
            localStorage.setItem("user", JSON.stringify(userData));
            window.location.href = "/";
        } else {
            alert("Błędne dane logowania!");
        }
    };

    const inputS = {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: `1px solid rgba(255, 95, 109, 0.2)`,
        backgroundColor: input,
        color: text,
        marginBottom: '20px',
        outline: 'none',
        fontWeight: '900',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: primaryGradient, fontFamily: 'Arial, sans-serif' }}>
            <div style={{ backgroundColor: card, padding: '50px', borderRadius: '30px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <h1 style={{ color: text, fontWeight: '900', fontSize: '32px', marginBottom: '10px', letterSpacing: '-1.5px' }}>FRIENDS+</h1>
                <p style={{ color: '#9ca3af', fontWeight: '900', fontSize: '12px', marginBottom: '30px' }}>ZALOGUJ SIĘ DO SWOJEJ SPOŁECZNOŚCI</p>

                <form onSubmit={handleLogin}>
                    <input style={inputS} type="email" placeholder="EMAIL" onChange={e => setEmail(e.target.value)} required />
                    <input style={inputS} type="password" placeholder="HASŁO" onChange={e => setPassword(e.target.value)} required />

                    <button type="submit" style={{
                        width: '100%', padding: '16px', background: primaryGradient,
                        color: 'white', border: 'none', borderRadius: '15px',
                        fontWeight: '900', fontSize: '16px', cursor: 'pointer',
                        boxShadow: '0 5px 15px rgba(255, 95, 109, 0.4)'
                    }}>
                        WEJDŹ
                    </button>
                </form>

                <p style={{ marginTop: '25px', fontSize: '13px', color: text, fontWeight: '900' }}>
                    NIE MASZ KONTA? <span onClick={() => navigate("/register")} style={{ color: '#FF5F6D', cursor: 'pointer' }}>ZAREJESTRUJ SIĘ</span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;