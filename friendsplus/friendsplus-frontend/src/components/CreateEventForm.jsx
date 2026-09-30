import { useState } from "react";

function CreateEventForm({ groupId, creatorId, onEventCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(
            `http://localhost:8080/api/events?groupId=${groupId}&creatorId=${creatorId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    description,
                    location,
                    eventDate: eventDate.length === 16 ? eventDate + ":00" : eventDate
                })
            }
        )
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to create event");
                }
                return res.json();
            })
            .then(() => {
                setTitle("");
                setDescription("");
                setLocation("");
                setEventDate("");
                onEventCreated();
            })
            .catch(err => {
                console.error(err);
                alert("Event creation failed");
            });
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        boxSizing: "border-box",
        fontFamily: "inherit"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "6px",
        fontWeight: "600",
        color: "#444"
    };

    return (
        <div style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
            marginBottom: "30px",
            border: "1px solid #e0e0e0"
        }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#2c3e50" }}>Create New Event</h3>

            <form onSubmit={handleSubmit}>

                {/* Title Field */}
                <div>
                    <label style={labelStyle}>Title</label>
                    <input
                        placeholder="e.g. Hiking Trip"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                        placeholder="What are the details?"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="3"
                        style={inputStyle}
                    />
                </div>

                {/* Location and Date Side-by-Side */}
                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Location</label>
                        <input
                            placeholder="e.g. Main Park"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Date & Time</label>
                        <input
                            type="datetime-local"
                            value={eventDate}
                            onChange={e => setEventDate(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        backgroundColor: "#4f46e5", // Modern Indigo color
                        color: "white",
                        border: "none",
                        padding: "14px",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "10px",
                        transition: "background-color 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#4338ca"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#4f46e5"}
                >
                    Create Event
                </button>
            </form>
        </div>
    );
}

export default CreateEventForm;