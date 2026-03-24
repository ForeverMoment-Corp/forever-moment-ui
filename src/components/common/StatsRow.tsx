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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((c, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl py-4 px-4 sm:px-[18px] flex items-center gap-[14px] transition-shadow duration-200 cursor-default hover:shadow-lg dark:hover:shadow-black/40"
                >
                    <div style={{
                        width: 40, height: 40,
                        borderRadius: 10,
                        background: c.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {c.icon}
                    </div>
                    <div>
                        <div className="text-[22px] font-semibold text-slate-900 dark:text-white leading-[1.2]">{c.value}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{c.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
