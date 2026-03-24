import { useTheme, COLOR_FAMILIES, generateCustomAccent } from '@/context/ThemeContext';

export const PresetColorGrid = () => {
    const { accent, setAccent } = useTheme();

    return (
        <div className="flex flex-wrap gap-x-8 gap-y-6">
            {COLOR_FAMILIES.map((family) => (
                <div key={family.name} className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase ml-1">
                        {family.name}
                    </span>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800/40 p-1.5 rounded-[12px] border border-slate-100 dark:border-gray-800">
                        {family.shades.map((hex) => {
                            const isSelected = accent.value === hex && accent.name !== 'Custom';
                            
                            // Quick luminance check for checkmark contrast
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            const isLight = (r * 0.299 + g * 0.587 + b * 0.114) > 186;

                            return (
                                <button
                                    key={hex}
                                    onClick={() => {
                                        const newAccent = generateCustomAccent(hex);
                                        newAccent.name = family.name;
                                        setAccent(newAccent);
                                    }}
                                    className={`
                                        relative w-8 h-8 rounded-full transition-all duration-200 cursor-pointer
                                        ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-900 scale-110 z-10' : 'hover:scale-110 opacity-90 hover:opacity-100'}
                                    `}
                                    style={{ background: hex }}
                                    title={`${family.name} (${hex})`}
                                >
                                    {isSelected && (
                                        <svg className="absolute inset-0 m-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#000' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
