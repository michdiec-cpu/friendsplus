import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const NotificationsPage = () => {
    const { card, text, border, bg, primaryGradient } = useContext(ThemeContext);
    const [notifications, setNotifications] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
        const fRes = await fetch(`http://localhost:8080/api/friends/pending/${user.id}`);
        if (fRes.ok) setPendingFriends(await fRes.json());
        const nRes = await fetch(`http://localhost:8080/api/notifications/${user.id}`);
        if (nRes.ok) setNotifications(await nRes.json());
    };

    useEffect(() => { fetchData(); }, []);

    const cardS = {
        backgroundColor: card,
        padding: '20px',
        borderRadius: '15px',
        border: `1px solid ${border}`,
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', color: text, fontWeight: '900' }}>
            <div style={{ backgroundColor: card, padding: '35px', borderRadius: '30px', border: `2px solid ${border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center', letterSpacing: '-1px' }}>POWIADOMIENIA</h2>

                {pendingFriends.length === 0 && notifications.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.3 }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔔</div>
                        <p>BRAK NOWYCH WIADOMOŚCI</p>
                    </div>
                ) : (
                    <>
                        {pendingFriends.map(f => (
                            <div key={f.id} style={cardS}>
                                <div style={{fontSize: '14px'}}>{f.user.username.toUpperCase()} CHCE CIĘ DODAĆ</div>
                                <div style={{display:'flex', gap:'8px'}}>
                                    <button onClick={() => {/* akceptuj */}} style={btnS('#10b981')}>TAK</button>
                                    <button onClick={() => {/* odrzuć */}} style={btnS('#6b7280')}>NIE</button>
                                </div>
                            </div>
                        ))}
                        {notifications.map(n => (
                            <div key={n.id} style={cardS}>
                                <div style={{fontSize: '13px', flex: 1}}>{n.content.toUpperCase()}</div>
                                <button style={btnS(null, border)}>OK</button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

const btnS = (color, border) => ({
    padding: '8px 16px', borderRadius: '10px', border: border ? `1px solid ${border}` : 'none',
    backgroundColor: color || 'transparent', color: color ? 'white' : 'inherit',
    fontWeight: '900', cursor: 'pointer', fontSize: '11px'
});

export default NotificationsPage;