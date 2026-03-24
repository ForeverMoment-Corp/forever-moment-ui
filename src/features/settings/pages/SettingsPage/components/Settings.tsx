import { useTheme, ACCENT_PRESETS } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Settings = () => {
    const { mode, accent, setMode, setAccent } = useTheme();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Customize the look and feel of your dashboard.
            </p>

            {/* ── Appearance ── */}
            <section className="mb-10">
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Appearance</h2>
                <div className="grid grid-cols-3 gap-3">
                    {([
                        { value: 'light' as const, label: 'Light', icon: Sun },
                        { value: 'dark' as const, label: 'Dark', icon: Moon },
                    ]).map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setMode(value)}
                            className={`
                                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                                ${mode === value
                                    ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                }
                            `}
                        >
                            <Icon
                                size={22}
                                className={mode === value ? 'text-[var(--accent)]' : 'text-gray-400'}
                            />
                            <span className={`text-sm font-medium ${mode === value ? 'text-[var(--accent)]' : 'text-gray-600 dark:text-gray-300'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Accent Color ── */}
            <section className="mb-10">
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Accent Color</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Choose a color that will be used for buttons, links, and active elements.
                </p>
                <div className="flex flex-wrap gap-3">
                    {ACCENT_PRESETS.map((preset) => {
                        const isSelected = accent.name === preset.name;
                        return (
                            <button
                                key={preset.name}
                                onClick={() => setAccent(preset)}
                                className={`
                                    group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                                    ${isSelected
                                        ? 'border-[var(--accent)] shadow-sm'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                    bg-white dark:bg-gray-800
                                `}
                                title={preset.name}
                            >
                                <div
                                    className="w-5 h-5 rounded-full shrink-0 transition-transform group-hover:scale-110"
                                    style={{ background: preset.value, boxShadow: isSelected ? `0 0 0 3px ${preset.ring}` : 'none' }}
                                />
                                <span className={`text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {preset.name}
                                </span>
                                {isSelected && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: preset.value }}>
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ── Preview ── */}
            <section>
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Preview</h2>
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                            style={{ background: 'var(--accent)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
                        >
                            Primary Button
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                        >
                            Secondary Button
                        </button>
                    </div>
                    <div
                        className="flex items-center gap-2 p-3 rounded-lg"
                        style={{ background: 'var(--accent-light)' }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: 'var(--accent)' }}
                        />
                        <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                            Active selection indicator
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Settings;
