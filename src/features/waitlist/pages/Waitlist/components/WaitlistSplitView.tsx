import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Hourglass, User, Mail, Phone, Calendar, ArrowRight, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WaitlistSplitViewProps {
    waitlist: any[];
    selectedWaitlistEntry: any | null;
    setSelectedWaitlistEntry: (item: any | null) => void;
    loading: boolean;
}

export const WaitlistSplitView: React.FC<WaitlistSplitViewProps> = ({
    waitlist,
    selectedWaitlistEntry,
    setSelectedWaitlistEntry,
    loading
}) => {
    const columns = [
        {
            header: 'Customer',
            accessorKey: 'customer',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-slate-500 underline decoration-slate-300">
                        {item.customer.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.customer}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.id}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Position',
            accessorKey: 'position',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-[11px] font-black text-slate-500">
                        #{item.position}
                    </div>
                </div>
            )
        },
        {
            header: 'Join Date',
            accessorKey: 'date',
            render: (item: any) => (
                <span className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400 italic">{item.date}</span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Priority' ? 'error' : item.status === 'Active' ? 'success' : 'neutral'} 
                />
            )
        }
    ];

    const renderListItem = useCallback((item: any, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                isSelected
                    ? "bg-[var(--accent-light)]"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-[var(--accent)] opacity-100" : "opacity-0"
            )} />
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 shrink-0">
                <Hourglass size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.customer}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    Position #{item.position} • {item.date}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Priority' ? 'error' : 'success'} 
                className="scale-75 origin-right"
            />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((item: any) => {
        if (!item) return null;
        return (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-800/20">
                            <UserPlus size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.customer}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">#{item.position} in line</span>
                                <StatusBadge status={item.status} variant={item.status === 'Priority' ? 'error' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 dark:bg-indigo-950 p-6 rounded-3xl text-white shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-8 text-white/5 group-hover:text-white/10 transition-all">
                        <CheckCircle size={120} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Estimated Wait Time</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black italic">~12 Days</span>
                            <span className="text-[12px] text-white/60 font-bold uppercase tracking-wider">Avg.</span>
                        </div>
                        <div className="pt-4 flex gap-4">
                            <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-[10px] text-white/40 font-black uppercase mb-1">Queue Size</p>
                                <p className="text-lg font-black italic">424</p>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                <p className="text-[10px] text-white/40 font-black uppercase mb-1">Your Rank</p>
                                <p className="text-lg font-black italic">#{item.position}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Contact Information</h3>
                    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800/60 overflow-hidden shadow-sm">
                        {[
                            { label: 'Email Address', value: 'ankit.shukla@example.com', icon: Mail },
                            { label: 'Phone Number', value: '+91 98765 43210', icon: Phone },
                            { label: 'Join Date', value: item.date, icon: Calendar },
                            { label: 'Waitlist Type', value: item.status, icon: Clock },
                        ].map((info, i) => (
                            <div key={i} className="px-5 py-4 flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-gray-800/40">
                                <div className="flex items-center gap-3">
                                    <info.icon size={16} className="text-slate-400" />
                                    <span className="text-[13px] font-bold text-slate-400">{info.label}</span>
                                </div>
                                <span className="text-[13.5px] font-black text-slate-700 dark:text-slate-200">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-4 rounded-2xl bg-indigo-600 dark:bg-indigo-500 font-black text-[13px] text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-2">
                        Promote to Priority
                    </button>
                    <button className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 font-black text-[13px] hover:bg-slate-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                        View History
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={waitlist}
            loading={loading}
            resourceName="Waitlist Entry"
            resourceNamePlural="Waitlist"
            selectedItem={selectedWaitlistEntry}
            onSelectItem={setSelectedWaitlistEntry}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Waitlist Details' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => {}}
            searchFields={['customer', 'id']}
        />
    );
};
