import { useTheme, generateCustomAccent } from '@/context/ThemeContext';
import { Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from "react-colorful";

export const CustomColorPicker = () => {
    const { accent, setAccent } = useTheme();
    const [showColorPicker, setShowColorPicker] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Handle outside clicks for closing the color picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        };
        if (showColorPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    return (
        <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <div className="relative" ref={popoverRef}>
                <button 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`
                        group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                        ${accent.name === 'Custom'
                            ? 'border-[var(--accent)] shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                        bg-white dark:bg-gray-800
                    `} 
                    title="Custom Color"
                >
                    <div className="relative w-5 h-5 rounded-full shrink-0 transition-transform group-hover:scale-110 flex items-center justify-center overflow-hidden" 
                         style={{ 
                             background: accent.name === 'Custom' ? accent.value : 'conic-gradient(from 180deg at 50% 50%, #ff0000 0deg, #ffff00 60deg, #00ff00 120deg, #00ffff 180deg, #0000ff 240deg, #ff00ff 300deg, #ff0000 360deg)',
                             boxShadow: accent.name === 'Custom' ? `0 0 0 3px ${accent.ring}` : 'none' 
                         }}>
                        
                        {accent.name !== 'Custom' && (
                            <Palette size={12} className="text-white drop-shadow-md relative z-0 pointer-events-none" />
                        )}
                    </div>
                    <span className={`text-sm font-medium ${accent.name === 'Custom' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        Custom
                    </span>
                </button>

                {showColorPicker && (
                    <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-100">
                        <HexColorPicker 
                            color={accent.name === 'Custom' ? accent.value : '#6c63ff'} 
                            onChange={(color) => setAccent(generateCustomAccent(color))} 
                        />
                        <div className="text-xs uppercase font-mono text-gray-500 dark:text-gray-400 font-semibold tracking-wider bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-md w-full text-center">
                            {accent.name === 'Custom' ? accent.value : '#6C63FF'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
