const API_BASE = "http://localhost:8080/api";

export async function getGroups() {
    const res = await fetch(`${API_BASE}/groups`);
    if (!res.ok) throw new Error("Failed to load groups");
    return res.json();
}
