import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import InterestPicker from '../components/InterestPicker';

const RegisterPage = () => {
    const { card, text, border, input, primaryGradient, isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "", email: "", password: "",
        firstName: "", lastName: "", phoneNumber: "",
        location: "", ageGroup: ""
    });
    const [interests, setInterests] = useState([]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const payload = { ...formData, interestNames: interests.map(i => i.name) };

        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert("KONTO ZAŁOŻONE! MOŻESZ SIĘ TERAZ ZALOGOWAĆ. ✨");
            navigate("/login");
        } else {
            const errMsg = await res.text();
            alert("BŁĄD: " + errMsg);
        }
    };

    const inputS = {
        width: '100%',
        padding: '14px 18px',
        borderRadius: '12px',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 95, 109, 0.2)'}`,
        backgroundColor: input,
        color: text,
        marginBottom: '12px',
        outline: 'none',
        fontWeight: '900',
        boxSizing: 'border-box',
        fontFamily: '"Segoe UI", sans-serif',
        transition: '0.3s border-color'
    };

    const sectionTitleS = {
        fontSize: '11px',
        color: '#FF5F6D',
        fontWeight: '900',
        margin: '25px 0 12px 0',
        letterSpacing: '1px',
        borderBottom: `1px solid ${isDarkMode ? '#333' : '#ffe0d1'}`,
        paddingBottom: '5px'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: primaryGradient,
            padding: '40px',
            fontFamily: '"Segoe UI", sans-serif',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: card,
                padding: '45px',
                borderRadius: '35px',
                width: '100%',
                maxWidth: '650px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                transition: '0.3s'
            }}>
                <h2 style={{ textAlign: 'center', color: text, fontWeight: '900', fontSize: '30px', marginBottom: '5px', letterSpacing: '-1.5px' }}>DOŁĄCZ DO NAS</h2>
                <p style={{ textAlign: 'center', color: '#9ca3af', fontWeight: '900', fontSize: '11px', marginBottom: '35px' }}>STWÓRZ SWÓJ PROFIL W FRIENDS+</p>

                <form onSubmit={handleRegister}>
                    <p style={sectionTitleS}>DANE DO LOGOWANIA</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input style={inputS} placeholder="LOGIN" onChange={e => setFormData({...formData, username: e.target.value})} required />
                        <input style={inputS} type="password" placeholder="HASŁO" onChange={e => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <input style={inputS} type="email" placeholder="ADRES E-MAIL" onChange={e => setFormData({...formData, email: e.target.value})} required />

                    <p style={sectionTitleS}>INFORMACJE O TOBIE</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input style={inputS} placeholder="IMIĘ" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        <input style={inputS} placeholder="NAZWISKO" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input style={inputS} placeholder="TELEFON" onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                        <input style={inputS} placeholder="MIASTO" onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>

                    <select style={inputS} onChange={e => setFormData({...formData, ageGroup: e.target.value})} required>
                        <option value="">WYBIERZ GRUPĘ WIEKOWĄ</option>
                        <option value="Nastolatek">NASTOLATEK (13-17)</option>
                        <option value="Dorosły">DOROSŁY (18-35)</option>
                        <option value="Senior">SENIOR (35+)</option>
                    </select>

                    <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff9f6',
                        borderRadius: '20px',
                        border: `1px dashed ${isDarkMode ? '#444' : '#FF5F6D'}`
                    }}>
                        <InterestPicker
                            selectedInterests={interests}
                            onAdd={h => setInterests([...interests, h])}
                            onRemove={n => setInterests(interests.filter(i => i.name !== n))}
                        />
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '20px',
                        background: primaryGradient,
                        color: 'white',
                        border: 'none',
                        borderRadius: '18px',
                        fontWeight: '900',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '35px',
                        boxShadow: '0 8px 25px rgba(255, 95, 109, 0.4)',
                        transition: '0.3s'
                    }}>
                        STWÓRZ KONTO
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '12px', color: text, fontWeight: '900' }}>
                    MASZ JUŻ KONTO? <span onClick={() => navigate("/login")} style={{ color: '#FF5F6D', cursor: 'pointer', textDecoration: 'underline' }}>ZALOGUJ SIĘ</span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;