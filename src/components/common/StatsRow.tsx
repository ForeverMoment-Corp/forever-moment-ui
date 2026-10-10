import React from 'react';

export interface StatCard {
    icon: React.ReactNode;
    iconBg: string;
    value: string | number;
    label: string;
}

export interface StatsRowProps {
    stats: StatCard[];
}

export const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {stats.map((c, i) => (
                <div
                    key={i}
                    className="min-w-0 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg py-2 px-3 flex items-center gap-2.5 transition-shadow duration-200 cursor-default hover:shadow-lg dark:hover:shadow-black/40"
                >
                    <div style={{
                        width: 32, height: 32,
                        borderRadius: 8,
                        background: c.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {c.icon}
                    </div>
                    <div className="min-w-0">
                        <div className="text-[18px] font-semibold text-slate-900 dark:text-white leading-[1.2]">{c.value}</div>
                        <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">{c.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
