import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const CreateGroupPage = () => {
    const { card, text, border, input } = useContext(ThemeContext);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("Inne");
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8080/api/groups?leaderId=${user.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description: desc, category })
        });
        if (res.ok) {
            alert("Grupa stworzona!");
            navigate("/groups");
        }
    };

    const inputS = { width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: input, color: text, marginTop: '8px', boxSizing: 'border-box', fontWeight: '900', outline: 'none' };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: card, padding: '40px', borderRadius: '24px', border: `1px solid ${border}`, transition: '0.3s' }}>
            <h2 style={{ color: text, marginBottom: '30px', textAlign: 'center' }}>Stwórz nową grupę</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '900', color: '#9ca3af', fontSize: '12px' }}>NAZWA GRUPY</label>
                    <input style={inputS} value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '900', color: '#9ca3af', fontSize: '12px' }}>KATEGORIA</label>
                    <select style={inputS} value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="Sport">Sport</option>
                        <option value="Gry">Gry</option>
                        <option value="Hobby">Hobby</option>
                        <option value="Nauka">Nauka</option>
                        <option value="Inne">Inne</option>
                    </select>
                </div>
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ fontWeight: '900', color: '#9ca3af', fontSize: '12px' }}>OPIS</label>
                    <textarea style={{ ...inputS, height: '100px', resize: 'none' }} value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer' }}>
                    Utwórz społeczność
                </button>
            </form>
        </div>
    );
};

export default CreateGroupPage;