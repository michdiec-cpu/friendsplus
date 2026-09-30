import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import InterestPicker from '../components/InterestPicker';

const ProfilePage = () => {
    const { card, text, border, input, primaryGradient, isDarkMode } = useContext(ThemeContext);
    const userRaw = localStorage.getItem("user");
    const currentUser = userRaw ? JSON.parse(userRaw) : null;

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phoneNumber: "",
        location: "", ageGroup: "", profileVisibility: "public",
        profilePhoto: ""
    });
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser?.id) {
            fetch(`http://localhost:8080/api/users/${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || "",
                        location: data.location || "",
                        ageGroup: data.ageGroup || "",
                        profileVisibility: data.profileVisibility || "public",
                        profilePhoto: data.profilePhoto || ""
                    });
                    setInterests(data.interests || []);
                    setLoading(false);
                });
        }
    }, [currentUser.id]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch(`http://localhost:8080/api/users/${currentUser.id}/upload-photo`, {
                method: "POST",
                body: uploadData,
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setFormData(prev => ({ ...prev, profilePhoto: updatedUser.profilePhoto }));
                localStorage.setItem("user", JSON.stringify(updatedUser));
                alert("ZDJĘCIE ZOSTAŁO ZMIENIONE! 📸");
            }
        } catch (err) {
            console.error("Błąd uploadu:", err);
            alert("NIE UDAŁO SIĘ WGRAĆ ZDJĘCIA");
        }
    };

    const handleSave = async () => {
        const payload = {
            ...formData,
            interestNames: interests.map(i => i.name)
        };

        const res = await fetch(`http://localhost:8080/api/users/${currentUser.id}/update-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const updated = await res.json();
            localStorage.setItem("user", JSON.stringify(updated));
            alert("ZMIANY ZOSTAŁY ZAPISANE! ✨");
        }
    };

    if (loading) return <div style={{color: text, textAlign:'center', padding:'50px', fontWeight:'900'}}>ŁADOWANIE PROFILU...</div>;

    const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${border}`, backgroundColor: input, color: text, marginBottom: '20px', outline: 'none', boxSizing: 'border-box', fontWeight: '900', fontSize: '14px' };
    const labelS = { display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase' };

    return (
        <div style={{ backgroundColor: card, padding: '40px', borderRadius: '30px', border: `2px solid ${border}`, color: text, maxWidth: '750px', margin: '0 auto', transition: '0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontFamily: '"Segoe UI", sans-serif' }}>

            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '900', letterSpacing: '-1.5px', fontSize: '28px' }}>USTAWIENIA PROFILU</h2>

            {/* ZDJĘCIE PROFILOWE */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    {formData.profilePhoto ? (
                        <img
                            src={formData.profilePhoto}
                            style={{ width: '130px', height: '130px', borderRadius: '25%', objectFit: 'cover', border: `4px solid ${border}`, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                            alt="Profil"
                        />
                    ) : (
                        <div style={{ width: '130px', height: '130px', borderRadius: '25%', background: primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '50px', fontWeight: '900', border: `4px solid ${border}` }}>
                            {currentUser.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <label style={uploadBtnS(primaryGradient)}>
                        ZMIEŃ
                        <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                    </label>
                </div>
            </div>

            {/* DANE OSOBOWE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={labelS}>Imię</label>
                    <input style={inputS} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                    <label style={labelS}>Nazwisko</label>
                    <input style={inputS} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={labelS}>Adres Email</label>
                    <input style={inputS} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                    <label style={labelS}>Numer Telefonu</label>
                    <input style={inputS} value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={labelS}>Miasto</label>
                    <input style={inputS} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                    <label style={labelS}>Grupa Wiekowa</label>
                    <select style={inputS} value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value})}>
                        <option value="">Wybierz...</option>
                        <option value="Nastolatek">Nastolatek (13-17)</option>
                        <option value="Dorosły">Dorosły (18-35)</option>
                        <option value="Senior">Senior (35+)</option>
                    </select>
                </div>
            </div>

            <label style={labelS}>Widoczność profilu</label>
            <select style={inputS} value={formData.profileVisibility} onChange={e => setFormData({...formData, profileVisibility: e.target.value})}>
                <option value="public">Publiczny</option>
                <option value="friends">Tylko dla znajomych</option>
                <option value="private">Prywatny</option>
            </select>

            {/* OKNO HOBBY */}
            <div style={{ marginTop: '10px', padding: '20px', backgroundColor: input, borderRadius: '20px', border: `2px solid ${border}` }}>
                <InterestPicker
                    selectedInterests={interests}
                    onAdd={h => {
                        if (!interests.find(i => i.name.toLowerCase() === h.name.toLowerCase())) {
                            setInterests([...interests, h]);
                        }
                    }}
                    onRemove={n => setInterests(interests.filter(i => i.name !== n))}
                />
            </div>

            <button onClick={handleSave} style={{
                width: '100%', padding: '18px', background: primaryGradient,
                color: 'white', border: 'none', borderRadius: '15px',
                fontWeight: '900', fontSize: '16px', cursor: 'pointer',
                marginTop: '30px', transition: '0.2s', boxShadow: '0 5px 15px rgba(255, 95, 109, 0.3)'
            }}>
                ZAPISZ WSZYSTKIE ZMIANY
            </button>
        </div>
    );
};

const uploadBtnS = (grad) => ({
    position: 'absolute', bottom: '-5px', right: '-5px',
    background: grad, color: 'white', padding: '6px 12px',
    borderRadius: '10px', fontSize: '10px', cursor: 'pointer',
    fontWeight: '900', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
});

export default ProfilePage;