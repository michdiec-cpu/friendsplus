import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const GroupDetailsPage = () => {
    const { id } = useParams();
    const { card, text, border, bg, input, isDarkMode } = useContext(ThemeContext);
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : { id: 0 };

    const [group, setGroup] = useState(null);
    const [activeTab, setActiveTab] = useState("chat");
    const [messages, setMessages] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [posts, setPosts] = useState([]); // OGŁOSZENIA
    const [pendingUsers, setPendingUsers] = useState([]);
    const [msgContent, setMsgContent] = useState("");
    const [postContent, setPostContent] = useState("");
    const [loading, setLoading] = useState(true);

    const [propDate, setPropDate] = useState("");
    const [propTime, setPropTime] = useState("");
    const [newProposal, setNewProposal] = useState({ title: "", description: "", location: "" });

    const fetchData = async () => {
        try {
            const [gRes, mRes, iRes, pRes, postRes] = await Promise.all([
                fetch(`http://localhost:8080/api/groups/${id}`).then(r => r.json()),
                fetch(`http://localhost:8080/api/messages/group/${id}`).then(r => r.json()),
                fetch(`http://localhost:8080/api/ideas/group/${id}`).then(r => r.json()),
                fetch(`http://localhost:8080/api/groups/${id}/pending-requests`).then(r => r.json()),
                fetch(`http://localhost:8080/api/groups/${id}/posts`).then(r => r.json())
            ]);

            setGroup(gRes);
            setMessages(Array.isArray(mRes) ? mRes : []);
            setIdeas(Array.isArray(iRes) ? iRes : []);
            setPendingUsers(Array.isArray(pRes) ? pRes : []);
            setPosts(Array.isArray(postRes) ? postRes : []);
            setLoading(false);
        } catch (err) {
            console.error("Błąd fetch:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [id, activeTab]);

    const isMember = group?.members?.some(m => Number(m.id) === Number(user.id));
    const isLeader = Number(group?.leader?.id) === Number(user.id);

    const handleAddPost = async () => {
        if(!postContent.trim()) return;
        await fetch(`http://localhost:8080/api/groups/${id}/posts?authorId=${user.id}`, {
            method: "POST", headers: {"Content-Type":"application/json"}, body: postContent
        });
        setPostContent(""); fetchData();
    };

    const handlePropose = async (immediate = false) => {
        if(!newProposal.title || !propDate || !propTime) return alert("Wypełnij tytuł i czas!");
        const payload = { ...newProposal, proposedDate: `${propDate}T${propTime}:00` };
        await fetch(`http://localhost:8080/api/ideas/propose?groupId=${id}&authorId=${user.id}&immediateAccept=${immediate}`, {
            method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)
        });
        setPropDate(""); setPropTime(""); setNewProposal({title:"", description:"", location:""});
        fetchData();
    };

    const handleVote = async (ideaId, choice) => {
        await fetch(`http://localhost:8080/api/ideas/${ideaId}/vote?userId=${user.id}&choice=${choice}`, { method: "POST" });
        fetchData();
    };

    if (loading) return <div style={{padding:'50px', textAlign:'center', color:text, fontWeight:'900'}}>Wczytywanie...</div>;

    return (
        <div style={{ color: text, fontWeight: '900' }}>
            {/* NAGŁÓWEK GRUPY */}
            <div style={{ backgroundColor: card, padding: '25px', borderRadius: '20px', border: `1px solid ${border}`, marginBottom: '25px' }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2 style={{margin: 0}}>{group?.name}</h2>
                    <span style={{fontSize:'12px', color:'#9ca3af'}}>{group?.category} • {group?.members?.length} członków</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button onClick={() => setActiveTab("chat")} style={tabBtn(activeTab === "chat", isDarkMode)}>Czat & Ogłoszenia</button>
                    <button onClick={() => setActiveTab("voting")} style={tabBtn(activeTab === "voting", isDarkMode)}>Głosowania</button>
                    {isLeader && <button onClick={() => setActiveTab("manage")} style={tabBtn(activeTab === "manage", isDarkMode)}>Zarządzaj</button>}
                </div>
            </div>

            {/* ZAKŁADKA CZAT  */}
            {activeTab === "chat" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '25px', height: '600px' }}>

                    {/* CZAT */}
                    <div style={containerS(card, border)}>
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: isDarkMode ? '#111827' : '#f8f9ff' }}>
                            {messages.map(m => (
                                <div key={m.id} style={msgS(Number(m.sender?.id) === Number(user.id), isDarkMode, border)}>
                                    <small style={{display:'block', fontSize:'10px', fontWeight:'900', marginBottom:'4px'}}>{m.sender?.username}</small>
                                    {m.content}
                                </div>
                            ))}
                        </div>
                        {isMember ? (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if(!msgContent.trim()) return;
                                await fetch(`http://localhost:8080/api/messages/send?senderId=${user.id}&groupId=${id}`, {
                                    method: "POST", headers: {"Content-Type":"application/json"}, body: msgContent
                                });
                                setMsgContent(""); fetchData();
                            }} style={{padding:'20px', borderTop:`1px solid ${border}`, display:'flex', gap:'10px', backgroundColor: card}}>
                                <input value={msgContent} onChange={e => setMsgContent(e.target.value)} style={inputS(input, text, border)} placeholder="Napisz do grupy..." />
                                <button type="submit" style={btnS('#4f46e5')}>Wyślij</button>
                            </form>
                        ) : <div style={{padding:'20px', textAlign:'center', color:'#9ca3af', backgroundColor: card}}>Dołącz, aby pisać.</div>}
                    </div>

                    {/* OGŁOSZENIA LIDERA */}
                    <div style={{ ...containerS(card, border), padding: '20px', backgroundColor: isDarkMode ? '#1e293b' : '#fff7ed', border: `2px solid #f59e0b` }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#f59e0b', fontSize: '14px' }}>OGŁOSZENIA LIDERA</h4>

                        {isLeader && (
                            <div style={{ marginBottom: '50px' }}>
                                <textarea
                                    value={postContent}
                                    onChange={e => setPostContent(e.target.value)}
                                    style={{ ...inputS(input, text, border), height: '60px', resize: 'none', fontSize: '12px' }}
                                    placeholder="Wpisz nowe ogłoszenie..."
                                />
                                <button onClick={handleAddPost} style={btnS('#f59e0b', '100%')}>Opublikuj komunikat</button>
                            </div>
                        )}

                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {posts.length === 0 ? <p style={{fontSize:'12px', color:'#9ca3af', textAlign:'center'}}>Brak ważnych ogłoszeń.</p> :
                                posts.slice(0, 10).map(p => (
                                    <div key={p.id} style={{ padding: '12px 0', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#fed7aa'}`, fontSize: '13px', lineHeight: '1.4' }}>
                                        <div style={{color: text}}>{p.content}</div>
                                        <small style={{color: '#9ca3af', fontSize:'10px', display:'block', marginTop:'5px'}}>{new Date(p.createdAt).toLocaleString()}</small>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* ZAKŁADKA GŁOSOWANIA */}
            {activeTab === "voting" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gridAutoRows: '1fr', gap: '20px' }}>
                    {/*Formularz propozycji*/}
                    <div style={{ ...ideaCardS(card, border), borderStyle: 'dashed', borderWidth: '2px' }}>
                        <h4 style={{marginTop:0}}>Zaproponuj spotkanie</h4>
                        <input placeholder="Co robimy?" style={{...inputS(input, text, border), marginBottom:'10px'}} value={newProposal.title} onChange={e => setNewProposal({...newProposal, title: e.target.value})} />
                        <div style={{display:'flex', gap:'5px', marginBottom:'10px'}}>
                            <input type="date" style={inputS(input, text, border)} value={propDate} onChange={e => setPropDate(e.target.value)} />
                            <input type="time" style={inputS(input, text, border)} value={propTime} onChange={e => setPropTime(e.target.value)} />
                        </div>
                        <button onClick={() => handlePropose(isLeader)} style={btnS('#4f46e5', '100%')}>Zgłoś pomysł</button>
                    </div>

                    {ideas.filter(i => i.status !== 'PROPOSED').map(idea => {
                        const yesC = idea.votes?.filter(v => v.choice).length || 0;
                        const noC = idea.votes?.filter(v => !v.choice).length || 0;
                        const hasVoted = idea.votes?.some(v => Number(v.userId) === Number(user.id));
                        return (
                            <div key={idea.id} style={ideaCardS(card, border)}>
                                <div style={{flex: 1}}>
                                    <h3 style={{margin:0}}>{idea.title}</h3>
                                    <p style={{fontSize:'12px', color:'#9ca3af'}}>{idea.description}</p>
                                    <div style={{fontSize:'11px', color:'#4f46e5'}}>📍 {idea.location} | 🕒 {idea.proposedDate ? new Date(idea.proposedDate).toLocaleString() : ''}</div>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <div style={{height:'6px', backgroundColor: border, borderRadius:'3px', overflow:'hidden', display:'flex', marginBottom:'10px'}}>
                                        <div style={{width: `${(yesC/(yesC+noC||1))*100}%`, backgroundColor:'#10b981'}}></div>
                                        <div style={{width: `${(noC/(yesC+noC||1))*100}%`, backgroundColor:'#ef4444'}}></div>
                                    </div>
                                    {idea.status === 'VOTING' ? (
                                        <div style={{display:'flex', gap:'10px'}}>
                                            <button onClick={() => handleVote(idea.id, true)} style={voteBtnS('#10b981', hasVoted)}>TAK</button>
                                            <button onClick={() => handleVote(idea.id, false)} style={voteBtnS('#ef4444', hasVoted)}>NIE</button>
                                        </div>
                                    ) : <div style={{textAlign:'center', color:'#10b981'}}>ZATWIERDZONE</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ZAKŁADKA ZARZĄDZAJ*/}
            {activeTab === "manage" && isLeader && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={cardS(card, border)}>
                        <h4>Prośby o dołączenie ({pendingUsers.length})</h4>
                        {pendingUsers.map(u => (
                            <div key={u.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${border}`}}>
                                <span>{u.username}</span>
                                <button onClick={async () => { await fetch(`http://localhost:8080/api/groups/${id}/accept-user/${u.id}`, {method:"POST"}); fetchData(); }} style={btnS('#10b981')}>Zaakceptuj</button>
                            </div>
                        ))}
                    </div>
                    <div style={cardS(card, border)}>
                        <h4>Pomysły do rozpatrzenia</h4>
                        {ideas.filter(i => i.status === 'PROPOSED').map(i => (
                            <div key={i.id} style={{padding:'15px', border:`1px solid ${border}`, borderRadius:'10px', marginBottom:'10px', backgroundColor:bg}}>
                                <strong>{i.title}</strong>
                                <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                                    <button onClick={() => fetch(`http://localhost:8080/api/ideas/${i.id}/start-vote?hours=24`, {method:"POST"}).then(fetchData)} style={btnS('#4f46e5')}>Głosowanie</button>
                                    <button onClick={() => fetch(`http://localhost:8080/api/ideas/${i.id}/accept-directly`, {method:"POST"}).then(fetchData)} style={btnS('#10b981')}>Akceptuj</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const tabBtn = (act, d) => ({ padding: '12px 20px', borderRadius: '10px', border: 'none', backgroundColor: act ? '#4f46e5' : (d ? '#374151' : '#f3f4f6'), color: act ? 'white' : 'inherit', fontWeight: '900', cursor: 'pointer' });
const containerS = (c, b) => ({ backgroundColor: c, borderRadius: '20px', border: `1px solid ${b}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' });
const msgS = (me, d, b) => ({ alignSelf: me ? 'flex-end' : 'flex-start', backgroundColor: me ? '#4f46e5' : (d ? '#374151' : '#fff'), color: me ? 'white' : 'inherit', padding: '10px 15px', borderRadius: '12px', maxWidth: '70%', border: `1px solid ${b}` });
const inputS = (bg, t, br) => ({ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${br}`, backgroundColor: bg, color: t, fontWeight: '900', outline: 'none', boxSizing:'border-box' });
const btnS = (c, w) => ({ padding: '10px 20px', backgroundColor: c, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', width: w || 'auto' });
const ideaCardS = (c, b) => ({ backgroundColor: c, padding: '25px', borderRadius: '20px', border: `1px solid ${b}`, display: 'flex', flexDirection: 'column' });
const cardS = (c, b) => ({ backgroundColor: c, padding: '25px', borderRadius: '20px', border: `1px solid ${b}` });
const voteBtnS = (c, a) => ({ flex: 1, padding: '10px', border: `2px solid ${c}`, backgroundColor: a ? c : 'transparent', color: a ? 'white' : c, borderRadius: '10px', fontWeight: '900', cursor: 'pointer', fontSize:'12px' });

export default GroupDetailsPage;