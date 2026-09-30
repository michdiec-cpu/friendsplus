import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        document.body.style.background = isDarkMode
            ? '#111111'
            : 'linear-gradient(135deg, #FFEDD5 0%, #FFD1B3 50%, #FFB38A 100%)';
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.margin = "0";
    }, [isDarkMode]);

    const theme = {
        isDarkMode,
        toggleDarkMode,
        primaryGradient: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
        bg: isDarkMode ? '#111111' : 'transparent',
        card: isDarkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)',
        header: isDarkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)',
        text: isDarkMode ? '#ffffff' : '#2d3436',
        border: isDarkMode ? '#333333' : '#FF5F6D',
        input: isDarkMode ? '#252525' : '#ffffff'
    };

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};