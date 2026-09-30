import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const InterestPicker = ({ selectedInterests, onAdd, onRemove }) => {
    const { isDarkMode, text, card, border, input, primaryGradient } = useContext(ThemeContext);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length >= 3) {
                try {
                    const res = await fetch(`http://localhost:8080/api/interests/search?q=${query}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                    }
                } catch (err) {
                    console.error("Błąd autocomplete:", err);
                }
            } else {
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [query]);

    const handleAdd = (interest) => {
        onAdd(interest);
        setQuery("");
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim() !== "") {
            e.preventDefault();
            handleAdd({ name: query.trim() });
        }
    };

    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <label style={{ fontWeight: '900', display: 'block', marginBottom: '10px', color: text, fontSize: '13px' }}>
                TWOJE ZAINTERESOWANIA
            </label>

            {/* */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                maxHeight: '120px',
                overflowY: 'auto',
                marginBottom: '12px',
                padding: '10px',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                borderRadius: '12px',
                border: `1px dashed ${border}`
            }}>
                {selectedInterests.length === 0 && (
                    <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '900' }}>NIE WYBRANO JESZCZE ŻADNYCH PASJI</span>
                )}
                {selectedInterests.map((interest, index) => (
                    <div key={index} style={{
                        background: primaryGradient,
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '900',
                        boxShadow: '0 2px 5px rgba(255, 95, 109, 0.2)'
                    }}>
                        {interest.name.toUpperCase()}
                        <span
                            onClick={() => onRemove(interest.name)}
                            style={{ cursor: 'pointer', fontWeight: '900', borderLeft: '1px solid rgba(255,255,255,0.4)', paddingLeft: '8px' }}
                        >
                            ×
                        </span>
                    </div>
                ))}
            </div>

            {/*  */}
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="WPISZ MIN. 3 ZNAKI..."
                    style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: `2px solid ${border}`,
                        backgroundColor: input,
                        color: text,
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontWeight: '900',
                        transition: '0.3s'
                    }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* */}
                {suggestions.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: '105%',
                        left: 0,
                        right: 0,
                        backgroundColor: card,
                        border: `2px solid ${border}`,
                        borderRadius: '15px',
                        zIndex: 1000,
                        listStyle: 'none',
                        padding: '5px 0',
                        margin: 0,
                        boxShadow: isDarkMode ? '0 15px 30px rgba(0,0,0,0.5)' : '0 10px 20px rgba(0,0,0,0.05)',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {suggestions.map((s, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleAdd(s)}
                                style={{
                                    padding: '12px 20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: text,
                                    borderBottom: idx !== suggestions.length - 1 ? `1px solid ${border}` : 'none',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = isDarkMode ? '#2d2d2d' : '#fff5f0'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <span style={{ fontWeight: '900' }}>{s.name.toUpperCase()}</span>
                                {/*  */}
                                <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '900' }}>
                                    {s.popularity || 0}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default InterestPicker;