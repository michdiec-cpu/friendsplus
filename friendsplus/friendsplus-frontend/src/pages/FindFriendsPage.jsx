import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const FindFriendsPage = () => {
    const navigate = useNavigate();
    const { isDarkMode, bg, card, text, border, input, primaryGradient } = useContext(ThemeContext);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [friendIds, setFriendIds] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const myHobbies = currentUser?.interests || [];

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/users/search?q=${query}&currentUserId=${currentUser.id}`);
            const data = await res.json();
            setResults(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchFriendIds = () => {
        if (currentUser?.id) {
            fetch(`http://localhost:8080/api/friends/list/${currentUser.id}`)
                .then(res => res.json())
                .then(data => setFriendIds(data.map(f => f.id)))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => {
        handleSearch();
        fetchFriendIds();
    }, []);

    const sendFriendRequest = async (userId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/friends/request?fromId=${currentUser.id}&toId=${userId}`, {
                method: "POST"
            });
            if (res.ok) {
                alert("ZAPROSZENIE WYŁANE!");
                fetchFriendIds();
            } else {
                alert(await res.text());
            }
        } catch (err) { console.error(err); }
    };

    const getCommonHobbies = (userInterests) => {
        if (!userInterests) return [];
        return userInterests.filter(uHobby =>
            myHobbies.some(myHobby => myHobby.name.toLowerCase() === uHobby.name.toLowerCase())
        );
    };

    const renderAvatar = (u, size) => {
        if (u.profilePhoto) {
            return <img src={u.profilePhoto} style={{ width: size, height: size, borderRadius: '15px', objectFit: 'cover', border: `2px solid ${border}` }} alt="Avatar" />;
        }
        return (
            <div style={{ width: size, height: size, borderRadius: '15px', background: primaryGradient, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900' }}>
                {u.username[0].toUpperCase()}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', color: text, transition: '0.3s' }}>
            <h2 style={{ marginBottom: '10px', fontWeight: '900', letterSpacing: '-1px' }}>ZNAJDŹ NOWYCH ZNAJOMYCH</h2>
            <p style={{ color: '#9ca3af', marginBottom: '30px', fontWeight: '900', fontSize: '12px' }}>POGADAJ Z KIMŚ ZANIM WYŚLESZ ZAPROSZENIE</p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="SZUKAJ PO IMIENIU, LOKALIZACJI LUB HOBBY..."
                    style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', border: `2px solid ${border}`, backgroundColor: input, color: text, outline: 'none', fontWeight: '900' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" style={{ padding: '14px 28px', background: primaryGradient, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>SZUKAJ</button>
            </form>

            <div style={gridStyle}>
                {loading ? <p>ŁADOWANIE...</p> : results.map(u => {
                    const common = getCommonHobbies(u.interests);
                    const isAlreadyFriend = friendIds.includes(u.id);

                    return (
                        <div key={u.id} style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', textAlign: 'center', border: `2px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.3s' }}>
                            {renderAvatar(u, '70px')}

                            <h3 style={{ margin: '15px 0 5px 0', color: text, fontWeight: '900' }}>{u.username.toUpperCase()}</h3>
                            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '15px', fontWeight: '900' }}>📍 {u.location?.toUpperCase() || 'BRAK LOKALIZACJI'}</p>

                            {common.length > 0 && (
                                <div style={commonBadgeStyle}>🤝 {common.length} WSPÓLNE HOBBY</div>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px', justifyContent: 'center' }}>
                                {u.interests && u.interests.map(h => (
                                    <span key={h.id} style={tagStyle(common.some(c => c.name === h.name), isDarkMode)}>
                                        {h.name.toUpperCase()}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                                <button onClick={() => navigate(`/chat/${u.id}`)} style={chatButtonStyle(primaryGradient)}>NAPISZ</button>
                                {isAlreadyFriend ? (
                                    <button disabled style={alreadyButtonStyle}>ZNAJOMY</button>
                                ) : (
                                    <button onClick={() => sendFriendRequest(u.id)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: primaryGradient, color: 'white', fontWeight: '900', cursor: 'pointer' }}>DODAJ</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const commonBadgeStyle = { backgroundColor: 'rgba(255, 95, 109, 0.1)', color: '#FF5F6D', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', marginBottom: '15px' };
const tagStyle = (isCommon, dark) => ({ padding: '4px 10px', borderRadius: '15px', fontSize: '10px', fontWeight: '900', backgroundColor: isCommon ? '#FF5F6D' : (dark ? '#333' : '#f3f4f6'), color: isCommon ? 'white' : 'inherit' });
const chatButtonStyle = (grad) => ({ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #FF5F6D', backgroundColor: 'transparent', color: '#FF5F6D', fontWeight: '900', cursor: 'pointer' });
const alreadyButtonStyle = { flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#333', color: '#9ca3af', fontWeight: '900' };

export default FindFriendsPage;