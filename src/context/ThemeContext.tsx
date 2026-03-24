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

export const COLOR_FAMILIES = [
    { name: 'Violet', shades: ['#c084fc', '#8b5cf6', '#7c3aed'] },
    { name: 'Blue', shades: ['#60a5fa', '#3b82f6', '#2563eb'] },
    { name: 'Emerald', shades: ['#34d399', '#10b981', '#059669'] },
    { name: 'Rose', shades: ['#fb7185', '#f43f5e', '#e11d48'] },
    { name: 'Amber', shades: ['#fbbf24', '#f59e0b', '#d97706'] },
    { name: 'Slate', shades: ['#94a3b8', '#64748b', '#475569'] },
];

export function generateCustomAccent(hex: string): AccentColor {
    // Basic validation fallback
    if (!/^#[0-9A-F]{6}$/i.test(hex)) {
        return generateCustomAccent('#8b5cf6'); // Default Violet-500
    }
    
    // Parse RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Darken for hover (multiply by 0.8)
    const hoverR = Math.floor(r * 0.8);
    const hoverG = Math.floor(g * 0.8);
    const hoverB = Math.floor(b * 0.8);
    const hoverHex = `#${(1 << 24 | hoverR << 16 | hoverG << 8 | hoverB).toString(16).slice(1)}`;
    
    return {
        name: 'Custom',
        value: hex,
        hover: hoverHex,
        light: `rgba(${r}, ${g}, ${b}, 0.15)`,
        ring: `rgba(${r}, ${g}, ${b}, 0.25)`,
        foreground: '#ffffff'
    };
}

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
                if (parsed.value) {
                    const loaded = generateCustomAccent(parsed.value);
                    loaded.name = parsed.name || 'Custom';
                    return loaded;
                }
            } catch {
                // Ignore parse errors and fallback
            }
        }
        const defaultGen = generateCustomAccent('#8b5cf6');
        defaultGen.name = 'Violet';
        return defaultGen;
    });

    // Apply on mount and when mode/accent changes
    useEffect(() => {
        applyMode(mode);
        localStorage.setItem(STORAGE_KEY_MODE, mode);
    }, [mode]);

    useEffect(() => {
        applyAccent(accent);
        if (accent.name === 'Custom') {
            localStorage.setItem(STORAGE_KEY_ACCENT, JSON.stringify({ name: 'Custom', value: accent.value }));
        } else {
            localStorage.setItem(STORAGE_KEY_ACCENT, JSON.stringify({ name: accent.name }));
        }
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
