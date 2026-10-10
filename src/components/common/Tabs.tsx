import { cn } from "@/utils/cn";

export interface TabItem {
    id: string;
    label: string;
}

export interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    variant?: "vertical" | "horizontal";
    className?: string;
}

export const Tabs = ({ tabs, activeTab, onTabChange, variant = "vertical", className }: TabsProps) => {
    if (variant === "horizontal") {
        return (
            <div className={cn("flex px-4 gap-4 border-b border-slate-100 dark:border-gray-800", className)}>
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => onTabChange(t.id)}
                        className={cn(
                            "bg-transparent border-none border-b-2 py-2 text-[13px] cursor-pointer transition-all tracking-wide -mb-[1px]",
                            activeTab === t.id
                                ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        // Mobile: horizontally scrollable strip. md+: vertical side nav.
        <div className={cn(
            "flex flex-row overflow-x-auto scrollbar-hide gap-1 shrink-0 w-full border-b px-2 py-1.5",
            "md:w-[140px] md:min-w-[140px] md:flex-col md:overflow-x-visible md:gap-0.5 md:border-b-0 md:border-r md:py-2 md:px-1.5",
            "border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50",
            className
        )}>
            {tabs.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onTabChange(t.id)}
                    className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all text-left relative whitespace-nowrap shrink-0 md:w-full md:shrink",
                        activeTab === t.id
                            ? "bg-white dark:bg-gray-800 text-[var(--accent)] font-semibold shadow-sm"
                            : "text-slate-500 hover:bg-white/70 dark:hover:bg-gray-800/50 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                >
                    {activeTab === t.id && (
                        <span className="hidden md:block absolute left-1.5 w-0.5 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
                    )}
                    <span className={activeTab === t.id ? "md:ml-2" : ""}>{t.label}</span>
                </button>
            ))}
        </div>
    );
};
