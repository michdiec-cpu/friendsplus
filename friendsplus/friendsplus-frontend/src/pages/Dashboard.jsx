import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // 1. POPRAWKA BŁĘDU: Dodałem 'isDarkMode' do pobieranych danych
    const { card, text, border, bg, input, primaryGradient, accentColor, isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || { id: 0, location: "" };

    const [popular, setPopular] = useState([]);
    const [localGroups, setLocalGroups] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [foundActivities, setFoundActivities] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newAct, setNewAct] = useState({ title: "", description: "" });

    const fetchData = async () => {
        try {
            const [pRes, mRes, nRes, gRes, aRes] = await Promise.all([
                fetch(`http://localhost:8080/api/interests/popular`).then(r => r.json()),
                fetch(`http://localhost:8080/api/events/user/${user.id}`).then(r => r.json()),
                fetch(`http://localhost:8080/api/notifications/${user.id}`).then(r => r.json()),
                fetch(`http://localhost:8080/api/groups`).then(r => r.json()),
                fetch(`http://localhost:8080/api/activities/recent`).then(r => r.json())
            ]);
            setPopular(pRes);
            setMyEvents(Array.isArray(mRes) ? mRes.slice(0, 3) : []);
            setNotifications(Array.isArray(nRes) ? nRes.slice(0, 4) : []);
            setFoundActivities(Array.isArray(aRes) ? aRes : []);
            if (user.location) {
                setLocalGroups(gRes.filter(g => g.description?.toUpperCase().includes(user.location.toUpperCase())).slice(0, 3));
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, [user.id]);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            fetch(`http://localhost:8080/api/activities/search?q=${searchQuery}`)
                .then(r => r.json()).then(data => setFoundActivities(data));
        } else if (searchQuery.length === 0) {
            fetch(`http://localhost:8080/api/activities/recent`).then(r => r.json()).then(data => setFoundActivities(data));
        }
    }, [searchQuery]);

    const handleCreateActivity = async () => {
        if (!newAct.title) return;
        const res = await fetch(`http://localhost:8080/api/activities?authorId=${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAct)
        });
        if (res.ok) {
            alert("AKTYWNOŚĆ OPUBLIKOWANA!");
            setIsCreating(false);
            setNewAct({ title: "", description: "" });
            fetchData();
        }
    };

    return (
        <div style={{ color: text, fontWeight: '900', fontFamily: '"Segoe UI", sans-serif' }}>
            <h1 style={{ marginBottom: '40px', letterSpacing: '-1.5px', fontSize: '32px' }}>WITAJ W FRIENDS+</h1>

            {/* SIATKA 4 PANELI */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                <div style={panelS(card, border)}><p style={labelS}>POPULARNE AKTYWNOŚCI</p>
                    {popular.map((i, idx) => (<div key={i.id} style={itemS(border)}><span>{idx + 1}. {i.name.toUpperCase()}</span><span style={{color: '#FF5F6D'}}>{i.count} OSÓB</span></div>))}
                </div>
                <div style={panelS(card, border)}><p style={labelS}>LOKALNIE: {user.location?.toUpperCase()}</p>
                    {localGroups.map(g => (<div key={g.id} style={itemS(border)}><span>{g.name.toUpperCase()}</span><button onClick={() => navigate(`/groups/${g.id}`)} style={miniBtnS(primaryGradient)}>ZOBACZ</button></div>))}
                </div>
                <div style={panelS(card, border)}><p style={labelS}>TWOJE SPOTKANIA</p>
                    {myEvents.map(e => (<div key={e.id} style={itemS(border)}><span>{e.title.toUpperCase()}</span><span style={{fontSize:'11px', color:'#FF5F6D'}}>{new Date(e.eventDate).toLocaleDateString()}</span></div>))}
                </div>
                <div style={panelS(card, border)}><p style={labelS}>POWIADOMIENIA</p>
                    {notifications.map(n => (<div key={n.id} style={itemS(border)}><span style={{fontSize:'11px'}}>{n.content.toUpperCase()}</span></div>))}
                </div>
            </div>

            {/* PANEL SZYBKICH AKTYWNOŚCI - POPRAWIONY UKŁAD */}
            <div style={{ backgroundColor: card, padding: '35px', borderRadius: '30px', border: `1.5px solid ${accentColor}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0 }}>SZYBKIE AKTYWNOŚCI (ZAGRAJMY, POGADAJMY)</h4>
                    <button onClick={() => setIsCreating(!isCreating)} style={miniBtnS(primaryGradient)}>{isCreating ? "ANULUJ" : "DODAJ MOJĄ"}</button>
                </div>

                {/* 2. POPRAWKA BŁĘDU Z WYCHODZENIEM POZA EKRAN: Dodano szerokość 100% i box-sizing */}
                {isCreating ? (
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <input style={searchBarS(input, text, border)} placeholder="CO CHCESZ ROBIĆ? (NP. JEDNA PARTIA SZACHÓW)" value={newAct.title} onChange={e => setNewAct({...newAct, title: e.target.value})} />
                        <button onClick={handleCreateActivity} style={btnS(primaryGradient)}>OPUBLIKUJ</button>
                    </div>
                ) : (
                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                        <input
                            style={searchBarS(input, text, border)}
                            placeholder="SZUKAJ AKTYWNOŚCI INNYCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}

                <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {foundActivities.map(act => (
                        <div key={act.id} style={{ padding: '15px', borderRadius: '15px', border: `1px solid ${border}`, backgroundColor: isDarkMode ? '#252525' : '#fff9f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '14px', color: accentColor }}>{act.title.toUpperCase()}</div>
                                <small style={{ color: '#9ca3af' }}>PRZEZ: {act.author?.username.toUpperCase()}</small>
                            </div>
                            {/* Unikamy sytuacji, gdzie użytkownik pisze sam do siebie */}
                            {Number(act.author?.id) !== Number(user.id) && (
                                <button onClick={() => navigate(`/chat/${act.author.id}`)} style={miniBtnS(primaryGradient)}>NAPISZ</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const panelS = (card, border) => ({ backgroundColor: card, padding: '25px', borderRadius: '25px', border: `1.5px solid ${border}`, minHeight: '230px', display: 'flex', flexDirection: 'column' });
const labelS = { fontSize: '10px', color: '#9ca3af', letterSpacing: '2px', marginBottom: '15px', borderBottom: '1px solid rgba(156, 163, 175, 0.2)', paddingBottom: '8px' };
const itemS = (border) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${border}22` });


const searchBarS = (bg, txt, brd) => ({ flex: 1, width: '100%', padding: '15px 20px', borderRadius: '12px', border: `1.5px solid ${brd}`, backgroundColor: bg, color: txt, fontWeight: '900', fontSize: '15px', outline: 'none', boxSizing: 'border-box' });
const miniBtnS = (grad) => ({ padding: '8px 16px', background: grad, color: 'white', border: 'none', borderRadius: '10px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' });
const btnS = (grad) => ({ padding: '0 30px', background: grad, color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' });

export default Dashboard;