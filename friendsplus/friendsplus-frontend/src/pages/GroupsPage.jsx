import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const GroupsPage = () => {
    const { card, text, border, input, isDarkMode, primaryGradient } = useContext(ThemeContext);
    const [groups, setGroups] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("WSZYSTKIE");
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const fetchGroups = async (searchQuery = "") => {
        setLoading(true);
        const url = searchQuery.length >= 3
            ? `http://localhost:8080/api/groups/search?q=${searchQuery}`
            : `http://localhost:8080/api/groups`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setGroups(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchGroups(); }, []);

    useEffect(() => {
        const timeOutId = setTimeout(() => fetchGroups(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    const filteredGroups = selectedCategory === "WSZYSTKIE"
        ? groups
        : groups.filter(g => g.category?.toUpperCase() === selectedCategory);

    const inputS = {
        padding: '14px 20px', borderRadius: '15px', border: `1.5px solid ${border}`,
        backgroundColor: input, color: text, fontWeight: '900', outline: 'none',
        height: '50px', boxSizing: 'border-box', transition: '0.3s'
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', fontWeight: '900', color: text }}>

            {/* PANEL WYSZUKIWANIA I FILTRÓW */}
            <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1.5px solid ${border}`, marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>ODKRYJ SPOŁECZNOŚCI</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 180px', gap: '15px', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={labelS}>SZUKAJ PO NAZWIE LUB HOBBY</label>
                        <input
                            style={{ ...inputS, width: '100%' }}
                            placeholder="NP. PLANSZÓWKI, SPORT, GAMING..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={labelS}>KATEGORIA</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ ...inputS, width: '100%', cursor: 'pointer' }}
                        >
                            <option value="WSZYSTKIE">WSZYSTKIE</option>
                            <option value="SPORT">SPORT</option>
                            <option value="GRY">GRY</option>
                            <option value="HOBBY">HOBBY</option>
                            <option value="NAUKA">NAUKA</option>
                        </select>
                    </div>
                    <button onClick={() => navigate("/groups/create")} style={{ ...btnS(primaryGradient), height: '50px' }}>
                        NOWA GRUPA
                    </button>
                </div>
            </div>

            {/* LISTA GRUP */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {loading ? <p style={{textAlign:'center', gridColumn:'1/-1'}}>SZUKAM...</p> :
                    filteredGroups.map(g => (
                        <div key={g.id} style={{ padding: '30px', borderRadius: '25px', backgroundColor: card, border: `1.5px solid ${border}`, display: 'flex', flexDirection: 'column', transition: '0.3s' }}>
                            <div style={{ fontSize: '10px', color: '#FF5F6D', marginBottom: '8px' }}>{g.category?.toUpperCase() || 'INNE'}</div>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{g.name.toUpperCase()}</h3>

                            {/* TAGI HOBBY GRUPY */}
                            <div style={{display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'15px'}}>
                                {g.interests?.map((it, idx) => (
                                    <span key={idx} style={tagS}>#{it.toUpperCase()}</span>
                                ))}
                            </div>

                            <p style={{ fontSize: '13px', color: isDarkMode ? '#9ca3af' : '#6b7280', flex: 1, lineHeight: '1.5' }}>{g.description}</p>

                            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px' }}>👥 {g.memberCount} CZŁONKÓW</span>
                                <button onClick={async () => {
                                    await fetch(`http://localhost:8080/api/groups/${g.id}/request-join/${user.id}`, { method: "POST" });
                                    alert("PROŚBA WYSŁANA!");
                                }} style={joinBtnS}>DOŁĄCZ</button>
                            </div>
                        </div>
                    ))}
            </div>
            {!loading && filteredGroups.length === 0 && <p style={{textAlign:'center', marginTop:'50px', opacity:0.5}}>NIE ZNALEŹLIŚMY TAKIEJ GRUPY...</p>}
        </div>
    );
};

const labelS = { fontSize: '10px', fontWeight: '900', color: '#9ca3af', letterSpacing: '1px' };
const tagS = { fontSize: '9px', color: '#FF5F6D', background: 'rgba(255, 95, 109, 0.1)', padding: '2px 8px', borderRadius: '5px' };
const btnS = (grad) => ({ padding: '0 20px', background: grad, color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: '900', transition: '0.3s' });
const joinBtnS = { backgroundColor: 'transparent', border: '2px solid #FF5F6D', color: '#FF5F6D', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '900', fontSize: '12px' };

export default GroupsPage;