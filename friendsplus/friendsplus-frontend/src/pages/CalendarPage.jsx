import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const CalendarPage = () => {
    const { card, text, border, bg, primaryGradient, accentColor, isDarkMode } = useContext(ThemeContext);
    const user = JSON.parse(localStorage.getItem("user"));
    const [myEvents, setMyEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:8080/api/events/user/${user.id}`)
                .then(res => res.json())
                .then(data => setMyEvents(data))
                .catch(err => console.error("BŁĄD POBIERANIA:", err));
        }
    }, [user.id]);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i);

    const monthNames = ["STYCZEŃ", "LUTY", "MARZEC", "KWIECIEŃ", "MAJ", "CZERWIEC", "LIPIEC", "SIERPIEŃ", "WRZESIEŃ", "PAŹDZIERNIK", "LISTOPAD", "GRUDZIEŃ"];

    const upcomingEvents = myEvents
        .filter(ev => new Date(ev.eventDate) >= new Date().setHours(0,0,0,0))
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            color: text,
            fontWeight: '900',
            fontFamily: '"Segoe UI", sans-serif'
        }}>

            {/* KALENDARZ */}
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                    backgroundColor: card,
                    padding: '20px 30px',
                    borderRadius: '20px',
                    border: `2px solid ${border}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '-1px' }}>KALENDARZ</h2>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} style={navBtnS(accentColor)}>‹</button>
                        <span style={{ minWidth: '160px', textAlign: 'center', fontSize: '16px' }}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} style={navBtnS(accentColor)}>›</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
                    {["PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"].map(d => (
                        <div key={d} style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', paddingBottom: '10px', letterSpacing: '1px' }}>{d}</div>
                    ))}
                    {days.map((day, idx) => {
                        const dailyEvents = myEvents.filter(ev => {
                            const d = new Date(ev.eventDate);
                            return d.getDate() === day &&
                                d.getMonth() === currentDate.getMonth() &&
                                d.getFullYear() === currentDate.getFullYear();
                        });

                        return day === null ? <div key={idx}></div> : (
                            <div key={idx} style={{
                                minHeight: '100px',
                                padding: '12px',
                                border: `2px solid ${border}`,
                                borderRadius: '18px',
                                backgroundColor: dailyEvents.length > 0 ? (isDarkMode ? 'rgba(255, 95, 109, 0.2)' : '#ffebd6') : card,
                                transition: '0.3s'
                            }}>
                                <span style={{ fontSize: '13px' }}>{day}</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                    {dailyEvents.map(ev => (
                                        <div key={ev.id} style={{ ...tinyEventBadge, background: primaryGradient }}>
                                            {ev.title.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* LISTA CHRONOLOGICZNA*/}
            <div style={{
                backgroundColor: card,
                borderRadius: '30px',
                border: `3px solid ${border}`,
                padding: '30px',
                height: 'fit-content',
                maxHeight: 'calc(100vh - 160px)',
                overflowY: 'auto',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', letterSpacing: '1px' }}>NADCHODZĄCE</h3>

                {upcomingEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.5 }}>
                        <div style={{fontSize: '30px', marginBottom: '10px'}}>🏜️</div>
                        <p style={{ color: '#9ca3af', fontSize: '12px' }}>BRAK NOWYCH WYDARZEŃ</p>
                    </div>
                ) : (
                    upcomingEvents.map(ev => (
                        <div key={ev.id} style={{
                            padding: '18px',
                            border: `2.5px solid ${border}`,
                            backgroundColor: isDarkMode ? '#2d2d2d' : '#fff5f0',
                            marginBottom: '15px',
                            borderRadius: '18px',
                            transition: '0.3s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/*  PASEK BOCZNY RAMKI */}
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: primaryGradient }}></div>

                            <div style={{ color: accentColor, fontSize: '14px', marginBottom: '8px', paddingLeft: '8px' }}>
                                {ev.title.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '12px', paddingLeft: '8px' }}>
                                MIEJSCE: {ev.location?.toUpperCase()}
                            </div>

                            <div style={{
                                padding: '8px 12px',
                                background: isDarkMode ? '#1a1a1a' : '#ffffff',
                                borderRadius: '10px',
                                border: `1px solid ${border}`,
                                fontSize: '12px',
                                display: 'inline-block',
                                color: text,
                                letterSpacing: '0.5px'
                            }}>
                                📅 {new Date(ev.eventDate).toLocaleDateString()} | {new Date(ev.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>

                            <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '12px', paddingLeft: '8px', opacity: 0.8 }}>
                                GRUPA: {ev.group?.name?.toUpperCase()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const navBtnS = (accent) => ({
    padding: '8px 18px',
    cursor: 'pointer',
    border: 'none',
    background: 'white',
    color: accent,
    borderRadius: '12px',
    fontWeight: '900',
    fontSize: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: '0.2s'
});

const tinyEventBadge = {
    fontSize: '9px',
    color: 'white',
    padding: '3px 6px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '900'
};

export default CalendarPage;