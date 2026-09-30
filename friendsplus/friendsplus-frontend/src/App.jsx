import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/MainLayout";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailsPage from "./pages/GroupDetailsPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import FindFriendsPage from "./pages/FindFriendsPage";
import ChatPage from "./pages/ChatPage";
import CalendarPage from "./pages/CalendarPage";
import OptionsPage from "./pages/OptionsPage";
import Dashboard from "./pages/Dashboard";
function App() {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    return (
        <ThemeProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={user ? <MainLayout><Dashboard /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/groups" element={user ? <MainLayout><GroupsPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/groups/create" element={user ? <MainLayout><CreateGroupPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/groups/:id" element={user ? <MainLayout><GroupDetailsPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <MainLayout><ProfilePage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/find-friends" element={user ? <MainLayout><FindFriendsPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/notifications" element={user ? <MainLayout><NotificationsPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/chat/:friendId" element={user ? <MainLayout><ChatPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/calendar" element={user ? <MainLayout><CalendarPage /></MainLayout> : <Navigate to="/login" />} />
                <Route path="/options" element={user ? <MainLayout><OptionsPage /></MainLayout> : <Navigate to="/login" />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;