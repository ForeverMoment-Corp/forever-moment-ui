import type { ElementType } from 'react';

interface StatCardProps {
    label: string;
    value: string;
    delta?: string;
    icon: ElementType;
    primary?: boolean;
}

export const StatCard = ({ label, value, delta, icon: Icon, primary }: StatCardProps) => {
    return (
        <div
            className={
                primary
                    ? 'bg-accent border border-accent rounded-xl p-4 text-white'
                    : 'bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4'
            }
        >
            <div
                className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center mb-3 ${
                    primary ? 'bg-white/20' : 'bg-accent-light dark:bg-accent/20'
                }`}
            >
                <Icon size={18} className={primary ? 'text-white' : 'text-accent'} />
            </div>
            <p className={`text-2xl font-bold ${primary ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{value}</p>
            <p className={`text-sm font-semibold mt-0.5 ${primary ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'}`}>
                {label}
            </p>
            {delta && (
                <p className={`text-xs mt-0.5 ${primary ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>{delta}</p>
            )}
        </div>
    );
};
