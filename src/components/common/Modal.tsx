import {
    Dialog,
    DialogContent,
} from './Dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export type ModalVariant = 'primary' | 'danger' | 'warning' | 'info';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    icon?: React.ElementType;
    variant?: ModalVariant;
    className?: string;
    footer?: React.ReactNode;
    showCloseButton?: boolean;
}

const variantStyles = {
    primary: {
        headerBg: 'bg-blue-50 dark:bg-blue-900/20',
        headerBorder: 'border-blue-100 dark:border-blue-900/30',
        iconContainer: 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconShadow: 'shadow-sm dark:shadow-none',
    },
    danger: {
        headerBg: 'bg-red-50 dark:bg-red-900/20',
        headerBorder: 'border-red-100 dark:border-red-900/30',
        iconContainer: 'from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40',
        iconColor: 'text-red-600 dark:text-red-400',
        iconShadow: 'shadow-sm dark:shadow-none',
    },
    warning: {
        headerBg: 'bg-amber-50 dark:bg-amber-900/20',
        headerBorder: 'border-amber-100 dark:border-amber-900/30',
        iconContainer: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconShadow: 'shadow-sm dark:shadow-none',
    },
    info: {
        headerBg: 'bg-slate-50 dark:bg-slate-800/50',
        headerBorder: 'border-slate-100 dark:border-slate-700',
        iconContainer: 'from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600',
        iconColor: 'text-slate-600 dark:text-slate-300',
        iconShadow: 'shadow-sm dark:shadow-none',
    }
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    icon: Icon,
    variant = 'info',
    className,
    footer,
    showCloseButton = false,
}: ModalProps) => {
    const styles = variantStyles[variant];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={cn(
                    "p-0 gap-0 flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_32px_80px_rgba(0,0,0,0.35)] dark:shadow-black rounded-[20px] w-[calc(100%-2rem)] mx-auto sm:w-full",
                    className || 'sm:max-w-md'
                )}
            >
                {/* Header Section */}
                <div className={cn("p-5 flex flex-col items-center text-center border-b shrink-0", styles.headerBg, styles.headerBorder)}>
                    {Icon && (
                        <div className={cn(
                            "w-[52px] h-[52px] bg-gradient-to-br rounded-[14px] flex items-center justify-center mb-5",
                            styles.iconContainer,
                            styles.iconShadow
                        )}>
                            <Icon size={24} className={styles.iconColor} />
                        </div>
                    )}

                    <h2
                        className="text-[20px] font-bold text-slate-900 dark:text-white leading-tight mb-1"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">
                            {description}
                        </p>
                    )}

                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                {children && (
                    <div className="px-5 py-4 overflow-y-auto flex-1">
                        {children}
                    </div>
                )}

                {/* Footer Section */}
                {footer ? (
                    <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2 shrink-0">
                        {footer}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};
