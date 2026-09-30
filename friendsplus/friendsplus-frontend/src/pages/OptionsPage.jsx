import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const OptionsPage = () => {
    const { isDarkMode, toggleDarkMode, card, text, border, bg, primaryGradient } = useContext(ThemeContext);
    const user = JSON.parse(localStorage.getItem("user"));
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [view, setView] = useState("general"); // general lub blocks

    const fetchBlocked = () => {
        fetch(`http://localhost:8080/api/friends/blocked/${user.id}`)
            .then(res => res.json())
            .then(data => setBlockedUsers(data));
    };

    useEffect(() => { if (view === "blocks") fetchBlocked(); }, [view]);

    const handleUnblock = async (targetId) => {
        const res = await fetch(`http://localhost:8080/api/friends/unblock?u1=${user.id}&u2=${targetId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            fetchBlocked();
            window.location.reload();
        }
    };

    const cardStyle = { backgroundColor: card, padding: '30px', borderRadius: '25px', border: `2px solid ${border}`, transition: '0.3s' };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', color: text, fontWeight: '900' }}>
            <h2 style={{ marginBottom: '30px', fontSize: '28px', letterSpacing: '-1px' }}>USTAWIENIA</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                <button onClick={() => setView("general")} style={tabBtn(view === "general", isDarkMode)}>OGÓLNE</button>
                <button onClick={() => setView("blocks")} style={tabBtn(view === "blocks", isDarkMode)}>ZARZĄDZAJ BLOKADAMI</button>
            </div>

            {view === "general" ? (
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: 0 }}>TRYB NOCNY</h4>
                            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#9ca3af' }}>ZMIEŃ KOLORYSTYKĘ APLIKACJI</p>
                        </div>
                        <button onClick={toggleDarkMode} style={{
                            padding: '12px 24px', borderRadius: '12px', border: 'none',
                            background: isDarkMode ? primaryGradient : '#e5e7eb',
                            color: isDarkMode ? 'white' : '#1f2937', fontWeight: '900', cursor: 'pointer'
                        }}>
                            {isDarkMode ? 'WŁĄCZONY' : 'WYŁĄCZONY'}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={cardStyle}>
                    <h4 style={{ marginTop: 0 }}>ZABLOKOWANI UŻYTKOWNICY</h4>
                    {blockedUsers.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Brak zablokowanych osób.</p>
                    ) : (
                        blockedUsers.map(u => (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: `1px solid ${border}` }}>
                                <span>{u.username}</span>
                                <button onClick={() => handleUnblock(u.id)} style={{ color: '#FF5F6D', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
                                    ODBLOKUJ
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const tabBtn = (active, dark) => ({
    padding: '12px 20px', borderRadius: '10px', border: 'none',
    backgroundColor: active ? '#FF5F6D' : (dark ? '#374151' : '#f3f4f6'),
    color: active ? 'white' : (dark ? '#9ca3af' : '#1f2937'),
    fontWeight: '900', cursor: 'pointer', fontSize: '12px'
});

export default OptionsPage;