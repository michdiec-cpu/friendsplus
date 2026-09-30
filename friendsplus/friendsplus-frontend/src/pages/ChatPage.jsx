import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const ChatPage = () => {
    const { friendId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode, card, text, border, input, primaryGradient } = useContext(ThemeContext);
    const user = JSON.parse(localStorage.getItem("user"));

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [friend, setFriend] = useState(null);
    const [status, setStatus] = useState("NONE");
    const scrollRef = useRef();

    const fetchAll = async () => {
        const uRes = await fetch(`http://localhost:8080/api/users/${friendId}`);
        if (uRes.ok) setFriend(await uRes.json());

        const sRes = await fetch(`http://localhost:8080/api/friends/status?u1=${user.id}&u2=${friendId}`);
        if (sRes.ok) setStatus(await sRes.text());

        const mRes = await fetch(`http://localhost:8080/api/messages/${user.id}/${friendId}`);
        if (mRes.ok) setMessages(await mRes.json());
    };

    useEffect(() => {
        fetchAll();
        const interval = setInterval(() => {
            fetch(`http://localhost:8080/api/messages/${user.id}/${friendId}`)
                .then(res => res.json()).then(data => setMessages(data));
        }, 3000);
        return () => clearInterval(interval);
    }, [friendId]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleAction = async (action) => {
        const url = `http://localhost:8080/api/friends/${action}?u1=${user.id}&u2=${friendId}`;
        const res = await fetch(url, { method: action === 'remove' ? "DELETE" : "POST" });
        if (res.ok) {
            alert(action === 'remove' ? "USUNIĘTO ZE ZNAJOMYCH" : "ZABLOKOWANO UŻYTKOWNIKA");
            fetchAll();
            if (action === 'remove') navigate("/");
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || status === 'blocked') return;
        await fetch(`http://localhost:8080/api/messages/send?senderId=${user.id}&receiverId=${friendId}`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: newMessage
        });
        setNewMessage(""); fetchAll();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', backgroundColor: card, borderRadius: '25px', border: `2px solid ${border}`, overflow: 'hidden', fontWeight: '900' }}>

            {/* NAGŁÓWEK CZATU */}
            <header style={{ padding: '20px 30px', borderBottom: `2px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {friend?.profilePhoto ? (
                        <img src={friend.profilePhoto} style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover', border: `2px solid ${border}` }} alt="P" />
                    ) : (
                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: primaryGradient, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                            {friend?.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: text }}>{friend?.username.toUpperCase()}</h3>
                        <div style={{ fontSize: '11px', color: status === 'accepted' ? '#10b981' : '#9ca3af' }}>
                            {status === 'accepted' ? 'TWOJA ZNAJOMOŚĆ ZAAKCEPTOWANA' :
                                status === 'pending' ? 'OCZEKIWANIE NA ZAAKCEPTOWANIE' :
                                    status === 'blocked' ? 'UŻYTKOWNIK ZABLOKOWANY' : 'ROZMAWIACIE PRYWATNIE'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {status === 'accepted' && <button onClick={() => handleAction('remove')} style={actionBtnS('#ef4444')}>USUŃ</button>}
                    {status !== 'blocked' && <button onClick={() => handleAction('block')} style={actionBtnS('#374151')}>BLOKUJ</button>}
                    {status === 'NONE' && (
                        <button onClick={() => handleAction('request')} style={actionBtnS('#10b981')}>DODAJ</button>
                    )}
                </div>
            </header>

            {/* WIADOMOŚCI */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: isDarkMode ? '#111827' : '#fffaf8' }}>
                {messages.map(m => {
                    const isMe = Number(m.sender.id) === Number(user.id);
                    return (
                        <div key={m.id} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            backgroundColor: isMe ? '#FF5F6D' : (isDarkMode ? '#1f2937' : '#fff'),
                            color: isMe ? 'white' : text,
                            padding: '12px 18px', borderRadius: isMe ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                            maxWidth: '70%', fontSize: '14px', border: isMe ? 'none' : `1px solid ${border}`,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}>
                            {m.content}
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* STOPKA */}
            <form onSubmit={handleSend} style={{ padding: '20px 30px', borderTop: `2px solid ${border}`, display: 'flex', gap: '15px', backgroundColor: card }}>
                <input
                    disabled={status === 'blocked'}
                    style={{ flex: 1, padding: '14px 20px', borderRadius: '15px', border: `2px solid ${border}`, backgroundColor: input, color: text, outline: 'none', fontWeight: '900' }}
                    value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    placeholder={status === 'blocked' ? "ZABLOKOWANO..." : "NAPISZ WIADOMOŚĆ..."}
                />
                <button type="submit" disabled={status === 'blocked'} style={{ background: primaryGradient, color: 'white', border: 'none', padding: '0 30px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', opacity: status === 'blocked' ? 0.5 : 1 }}>WYŚLIJ</button>
            </form>
        </div>
    );
};

const actionBtnS = (col) => ({ backgroundColor: 'transparent', border: `2px solid ${col}`, color: col, padding: '6px 12px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', fontSize: '11px' });

export default ChatPage;