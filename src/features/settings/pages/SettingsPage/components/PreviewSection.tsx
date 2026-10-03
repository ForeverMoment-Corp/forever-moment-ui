export const PreviewSection = () => {
    return (
        <div className="bg-white dark:bg-[#0f1117] rounded-lg border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-gray-900/20">
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Live Preview</h2>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">See how your accent color translates to buttons, active states, and focus rings.</p>
            </div>
            <div className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        className="px-[18px] py-[9px] rounded-[10px] text-[13.5px] font-semibold text-white transition-all shadow-[0_2px_6px_var(--accent-ring)]"
                        style={{ background: 'var(--accent)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Primary Action
                    </button>
                    <button
                        className="px-[18px] py-[9px] rounded-[10px] text-[13.5px] font-semibold transition-all border border-slate-200 bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] dark:border-gray-700 dark:bg-gray-900 shadow-sm"
                        style={{ color: 'var(--accent)' }}
                    >
                        Secondary Action
                    </button>

                    <div className="w-px h-8 bg-slate-200 dark:bg-gray-700 mx-2"></div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--accent-light)' }}>
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: 'var(--accent)' }} />
                        <span className="text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>Active State Indicator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
