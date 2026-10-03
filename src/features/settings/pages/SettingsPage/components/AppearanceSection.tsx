import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const AppearanceSection = () => {
    const { mode, setMode } = useTheme();

    return (
        <div className="bg-white dark:bg-[#0f1117] rounded-lg border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-gray-900/20">
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Appearance</h2>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Select your preferred color mode across the entire interface.</p>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 max-w-md">
                    {([
                        { value: 'light' as const, label: 'Light', icon: Sun },
                        { value: 'dark' as const, label: 'Dark', icon: Moon },
                    ]).map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setMode(value)}
                            className={`
                                flex flex-col items-center gap-2.5 p-3 rounded-[12px] border-2 transition-all duration-200 cursor-pointer
                                ${mode === value
                                    ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-sm'
                                    : 'border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                }
                            `}
                        >
                            <Icon
                                size={24}
                                className={mode === value ? 'text-[var(--accent)]' : 'text-slate-400'}
                                strokeWidth={mode === value ? 2.5 : 2}
                            />
                            <span className={`text-[13.5px] font-semibold ${mode === value ? 'text-[var(--accent)]' : 'text-slate-600 dark:text-slate-300'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
