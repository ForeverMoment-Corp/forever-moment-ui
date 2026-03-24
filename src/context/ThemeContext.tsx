import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface AccentColor {
    name: string;
    value: string;       // Main accent (e.g. #6c63ff)
    hover: string;       // Hover shade
    light: string;       // Light bg tint
    ring: string;        // Focus ring
    foreground: string;  // Text on accent bg
}

export const ACCENT_PRESETS: AccentColor[] = [
    {
        name: 'Violet',
        value: '#6c63ff',
        hover: '#5a52e8',
        light: '#ede9ff',
        ring: 'rgba(108,99,255,0.25)',
        foreground: '#ffffff',
    },
    {
        name: 'Blue',
        value: '#3b82f6',
        hover: '#2563eb',
        light: '#dbeafe',
        ring: 'rgba(59,130,246,0.25)',
        foreground: '#ffffff',
    },
    {
        name: 'Emerald',
        value: '#10b981',
        hover: '#059669',
        light: '#d1fae5',
        ring: 'rgba(16,185,129,0.25)',
        foreground: '#ffffff',
    },
    {
        name: 'Rose',
        value: '#f43f5e',
        hover: '#e11d48',
        light: '#ffe4e6',
        ring: 'rgba(244,63,94,0.25)',
        foreground: '#ffffff',
    },
    {
        name: 'Amber',
        value: '#f59e0b',
        hover: '#d97706',
        light: '#fef3c7',
        ring: 'rgba(245,158,11,0.25)',
        foreground: '#ffffff',
    },
    {
        name: 'Slate',
        value: '#475569',
        hover: '#334155',
        light: '#f1f5f9',
        ring: 'rgba(71,85,105,0.25)',
        foreground: '#ffffff',
    },
];

interface ThemeContextType {
    mode: ThemeMode;
    accent: AccentColor;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_MODE = 'fm-theme-mode';
const STORAGE_KEY_ACCENT = 'fm-theme-accent';

function applyMode(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

function applyAccent(accent: AccentColor) {
    const root = document.documentElement;
    root.style.setProperty('--accent', accent.value);
    root.style.setProperty('--accent-hover', accent.hover);
    root.style.setProperty('--accent-light', accent.light);
    root.style.setProperty('--accent-ring', accent.ring);
    root.style.setProperty('--accent-foreground', accent.foreground);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_MODE);
        if (saved === 'dark' || saved === 'light') return saved;
        // System preference fallback
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });

    const [accent, setAccentState] = useState<AccentColor>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_ACCENT);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const match = ACCENT_PRESETS.find(p => p.name === parsed.name);
                return match || ACCENT_PRESETS[0];
            } catch {
                return ACCENT_PRESETS[0];
            }
        }
        return ACCENT_PRESETS[0]; // Default: Violet
    });

    // Apply on mount and when mode/accent changes
    useEffect(() => {
        applyMode(mode);
        localStorage.setItem(STORAGE_KEY_MODE, mode);
    }, [mode]);

    useEffect(() => {
        applyAccent(accent);
        localStorage.setItem(STORAGE_KEY_ACCENT, JSON.stringify({ name: accent.name }));
    }, [accent]);

    const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
    const toggleMode = useCallback(() => setModeState(prev => prev === 'light' ? 'dark' : 'light'), []);
    const setAccent = useCallback((a: AccentColor) => setAccentState(a), []);

    return (
        <ThemeContext.Provider value={{ mode, accent, setMode, toggleMode, setAccent }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return ctx;
}
