import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RotateCcw, DollarSign, User, Calendar, MessageSquare, ShieldCheck, AlertCircle, History } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RefundsSplitViewProps {
    refunds: any[];
    selectedRefund: any | null;
    setSelectedRefund: (item: any | null) => void;
    loading: boolean;
}

export const RefundsSplitView: React.FC<RefundsSplitViewProps> = ({
    refunds,
    selectedRefund,
    setSelectedRefund,
    loading
}) => {
    const columns = [
        {
            header: 'Refund #',
            accessorKey: 'id',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.id}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                </div>
            )
        },
        {
            header: 'Customer',
            accessorKey: 'customer',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {item.customer.charAt(0)}
                    </div>
                    <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-400">{item.customer}</span>
                </div>
            )
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            render: (item: any) => (
                <span className="text-[13.5px] font-black text-slate-900 dark:text-white">{item.amount}</span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Completed' ? 'success' : item.status === 'Processing' ? 'info' : 'warning'} 
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
                <RotateCcw size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.id}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.customer} • {item.amount}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Completed' ? 'success' : 'warning'} 
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
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm border border-amber-100/50 dark:border-amber-800/20">
                            <RotateCcw size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">Refund Request</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.id}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Completed' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-100 dark:border-gray-800 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refund Amount</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{item.amount}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-100 dark:border-gray-800 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Booking</p>
                        <p className="text-[14px] font-bold text-slate-700 dark:text-slate-200">#BK-2025-001</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider italic bg-slate-100 dark:bg-gray-800/60 inline-block px-3 py-1 rounded-lg">Reason for Refund</h3>
                    <p className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed italic bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                        {item.reason}
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Refund Timeline</h3>
                    <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-gray-800">
                        {[
                            { step: 'Request Initiated', date: item.date, icon: MessageSquare, current: false },
                            { step: 'Manager Approval', date: 'Processing', icon: ShieldCheck, current: true },
                        ].map((node, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className={cn(
                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
                                    node.current ? "bg-amber-500 border-amber-500 text-white" : "bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400"
                                )}>
                                    <node.icon size={14} />
                                </div>
                                <div className="space-y-0.5 pt-1">
                                    <p className={cn("text-[13px] font-bold", node.current ? "text-slate-900 dark:text-white" : "text-slate-500")}>{node.step}</p>
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{node.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button className="flex-1 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[13px] hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                        <RotateCcw size={16} />
                        Approve Refund
                    </button>
                    <button className="px-6 py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-[13px] hover:bg-rose-100 transition-all border border-rose-100">
                        Decline
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={refunds}
            loading={loading}
            resourceName="Refund"
            resourceNamePlural="Refunds"
            selectedItem={selectedRefund}
            onSelectItem={setSelectedRefund}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Refund Details' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => {}}
            searchFields={['id', 'customer', 'reason']}
        />
    );
};
