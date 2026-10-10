import { cn } from '@/utils/cn';

interface StatusBadgeProps {
    isActive?: boolean;
    status?: string | number;
    activeValue?: string;
    className?: string;
    variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
}

export const StatusBadge = ({ 
    isActive, 
    status, 
    activeValue = 'Active', 
    className,
    variant: manualVariant 
}: StatusBadgeProps) => {
    // Determine active state from either boolean or string prop
    const active = isActive !== undefined ? isActive : status === activeValue;
    const label = isActive !== undefined ? (active ? 'Active' : 'Inactive') : (status?.toString() || '-');

    // Auto-determine variant if not manually provided
    const variant = manualVariant || (active ? 'success' : 'neutral');

    const variantStyles = {
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/20',
        error: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/20',
        warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/20',
        info: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/20',
        neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-2 py-0.5 text-[11px] font-black uppercase tracking-wider rounded-md whitespace-nowrap transition-all duration-200',
            variantStyles[variant],
            className
        )}>
            {label}
        </span>
    );
};

