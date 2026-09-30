import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, bg, card, text, border, header, primaryGradient } = useContext(ThemeContext);

    const [pendingCount, setPendingCount] = useState(0);
    const [friends, setFriends] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredNav, setHoveredNav] = useState(null);
    const [hoveredSide, setHoveredSide] = useState(null);

    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : { username: "GOŚĆ", id: 0 };
    const userName = (user?.username || "GOŚĆ").toUpperCase();

    const fetchData = async () => {
        if (!user.id || user.id === 0) return;
        try {
            const [pRes, nRes, fRes, gRes] = await Promise.all([
                fetch(`http://localhost:8080/api/friends/pending/${user.id}`),
                fetch(`http://localhost:8080/api/notifications/${user.id}`),
                fetch(`http://localhost:8080/api/friends/list/${user.id}`),
                fetch(`http://localhost:8080/api/groups/user/${user.id}`)
            ]);
            if (pRes.ok && nRes.ok) {
                const fCount = (await pRes.json()).length;
                const nCount = (await nRes.json()).length;
                setPendingCount(fCount + nCount);
            }
            if (fRes.ok) setFriends(await fRes.json());
            if (gRes.ok) setUserGroups(await gRes.json());
        } catch (err) { console.error("Błąd ładowania danych"); }
    };

    useEffect(() => { fetchData(); }, [user.id, location.pathname]);

    const renderAvatar = (targetUser, size) => {
        if (targetUser?.profilePhoto) {
            return <img src={targetUser.profilePhoto} style={{ width: size, height: size, borderRadius: '12px', objectFit: 'cover', border: `1px solid ${isDarkMode ? '#555' : '#FF5F6D'}` }} alt="P" />;
        }
        return (
            <div style={{ width: size, height: size, borderRadius: '12px', background: primaryGradient, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: parseInt(size) > 30 ? '18px' : '12px' }}>
                {targetUser?.username?.charAt(0).toUpperCase()}
            </div>
        );
    };

    const navItemStyle = (path, isHovered) => ({
        padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '900',
        transition: '0.3s all', display: 'flex', alignItems: 'center',
        background: (location.pathname === path || isHovered) ? primaryGradient : 'transparent',
        color: (location.pathname === path || isHovered) ? 'white' : text,
        boxShadow: (location.pathname === path || isHovered) ? '0 4px 12px rgba(255, 95, 109, 0.2)' : 'none',
    });

    const sidebarItemStyle = (isHovered) => ({
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '14px',
        cursor: 'pointer', marginBottom: '5px', transition: '0.2s', textDecoration: 'none', color: text,
        backgroundColor: isHovered ? (isDarkMode ? '#2d2d2d' : 'rgba(255, 95, 109, 0.15)') : 'transparent',
        border: `1px solid ${isHovered ? (isDarkMode ? '#555' : '#FF5F6D') : 'transparent'}`,
        fontWeight: '900'
    });

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw',
            backgroundColor: bg, color: text, transition: 'background-color 0.3s',
            fontFamily: '"Segoe UI", sans-serif', fontWeight: '900'
        }}>
            {/* HEADER */}
            <header style={{
                height: '75px', backgroundColor: header, borderBottom: `1.5px solid ${isDarkMode ? '#333' : '#FF5F6D'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px',
                zIndex: 1000, backdropFilter: 'blur(10px)', boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <h1 style={{ background: primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, fontSize: '30px', fontWeight: '900', cursor: 'pointer', letterSpacing: '-1.5px' }} onClick={() => navigate("/")}>Friends+</h1>
                    <nav style={{ display: 'flex', gap: '8px' }}>
                        {[{p:'/', l:'GŁÓWNA'}, {p:'/find-friends', l:'ZNAJOMI'}, {p:'/groups', l:'GRUPY'}, {p:'/calendar', l:'KALENDARZ'}].map(item => (
                            <Link key={item.p} to={item.p} style={navItemStyle(item.p, hoveredNav === item.p)} onMouseEnter={()=>setHoveredNav(item.p)} onMouseLeave={()=>setHoveredNav(null)}>{item.l}</Link>
                        ))}
                    </nav>
                </div>

                {/*PROFIL*/}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                        background: isDarkMode ? '#2d2d2d' : '#fff5f0', padding: '8px 18px',
                        borderRadius: '16px', border: `1.5px solid ${isDarkMode ? '#444' : '#FF5F6D'}`
                    }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <span style={{ fontWeight: '900', fontSize: '13px', color: text }}>{userName}</span>
                        <div style={{ position: 'relative' }}>
                            {renderAvatar(user, '40px')}
                            {pendingCount > 0 && <div style={badgeStyle}>{pendingCount}</div>}
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute', top: '120%', right: 0, minWidth: '220px',
                            borderRadius: '20px', backgroundColor: card, border: `1.5px solid ${isDarkMode ? '#444' : '#FF5F6D'}`,
                            padding: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', zIndex: 1100
                        }}>
                            <Link to="/profile" style={dropItemStyle(text)} onClick={() => setIsDropdownOpen(false)}>MOJ PROFIL</Link>
                            <Link to="/notifications" style={dropItemStyle(text)} onClick={() => setIsDropdownOpen(false)}>POWIADOMIENIA ({pendingCount})</Link>
                            <Link to="/options" style={dropItemStyle(text)} onClick={() => setIsDropdownOpen(false)}>OPCJE</Link>
                            <div style={{ borderTop: `1px solid ${border}`, margin: '8px 0' }}></div>
                            <button onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} style={logoutButtonStyle}>WYLOGUJ MNIE</button>
                        </div>
                    )}
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* SIDEBAR */}
                <aside style={{ width: '300px', padding: '25px', backgroundColor: card, borderRight: `1.5px solid ${isDarkMode ? '#333' : '#FF5F6D'}`, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <p style={labelStyle}>KOLEDZY</p>
                        {friends.map(f => (
                            <div key={f.id} onClick={() => navigate(`/chat/${f.id}`)}
                                 onMouseEnter={() => setHoveredSide('f'+f.id)} onMouseLeave={() => setHoveredSide(null)}
                                 style={sidebarItemStyle(hoveredSide === 'f'+f.id)}>
                                {renderAvatar(f, '32px')}
                                <span style={{ flex: 1, fontSize: '14px' }}>{f.username.toUpperCase()}</span>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid white' }}></div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <p style={labelStyle}>MOJE GRUPY</p>
                            <Link to="/groups/create" style={{ textDecoration: 'none', background: primaryGradient, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>+</Link>
                        </div>
                        {userGroups.map(g => (
                            <Link key={g.id} to={`/groups/${g.id}`}
                                  onMouseEnter={() => setHoveredSide('g'+g.id)} onMouseLeave={() => setHoveredSide(null)}
                                  style={{ ...sidebarItemStyle(hoveredSide === 'g'+g.id), textDecoration: 'none' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: primaryGradient, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '13px' }}>
                                    {g.name?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '14px' }}>{g.name.toUpperCase()}</span>
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* MAIN */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '40px', backgroundColor: bg }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>{children}</div>
                </main>
            </div>
        </div>
    );
};

const badgeStyle = { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#FF5F6D', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', fontWeight: '900' };
const dropItemStyle = (c) => ({ display: 'block', padding: '12px 15px', color: c, textDecoration: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '13px', transition: '0.2s' });
const logoutButtonStyle = { width: '100%', textAlign: 'left', padding: '12px 15px', color: '#FF5F6D', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '900', fontSize: '13px' };
const labelStyle = { fontSize: '11px', fontWeight: '900', color: '#9ca3af', letterSpacing: '2px', marginBottom: '15px' };

export default MainLayout;