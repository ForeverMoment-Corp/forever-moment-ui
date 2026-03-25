import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CreditCard, Download, ExternalLink, HandCoins } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PayoutsSplitViewProps {
    payouts: any[];
    selectedPayout: any | null;
    setSelectedPayout: (item: any | null) => void;
    handleOpenModal: (item?: any) => void;
    loading: boolean;
}

export const PayoutsSplitView: React.FC<PayoutsSplitViewProps> = ({
    payouts,
    selectedPayout,
    setSelectedPayout,
    handleOpenModal,
    loading
}) => {
    const columns = [
        {
            header: 'Vendor',
            accessorKey: 'vendor',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.vendor}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.id}</span>
                </div>
            )
        },
        {
            header: 'Net Payout',
            accessorKey: 'netPayout',
            render: (item: any) => (
                <div className="flex flex-col text-right pr-4">
                    <span className="text-[14px] font-black text-slate-900 dark:text-white">₹{item.netPayout.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Comm: ₹{item.commission.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={
                        item.status === 'Completed' ? 'success' : 
                        item.status === 'Pending' ? 'warning' : 
                        item.status === 'Processing' ? 'info' : 'neutral'
                    } 
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
                <CreditCard size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.vendor}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    ₹{item.netPayout.toLocaleString()} • {item.period}
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
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100/50 dark:border-emerald-800/20">
                            <HandCoins size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.vendor}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.id}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Completed' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-gray-700">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl text-white shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Settlement</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black italic">₹{item.netPayout.toLocaleString()}</span>
                        <span className="text-[12px] text-emerald-400 font-bold font-mono">NET</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Statement Breakdown</h3>
                    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800/60 overflow-hidden">
                        {[
                            { label: 'Gross Booking Amount', value: '₹' + item.amount.toLocaleString() },
                            { label: 'Commission Fee (10%)', value: '- ₹' + item.commission.toLocaleString(), color: 'text-red-500' },
                            { label: 'Net Payable', value: '₹' + item.netPayout.toLocaleString(), bold: true },
                            { label: 'Settlement Date', value: item.date },
                        ].map((info, i) => (
                            <div key={i} className="px-5 py-4 flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-gray-800/40">
                                <span className="text-[13px] font-bold text-slate-400">{info.label}</span>
                                <span className={`text-[13px] ${info.bold ? 'font-black' : 'font-bold'} ${info.color || 'text-slate-700 dark:text-slate-200'}`}>{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-gray-800 font-black text-[13px] text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all border border-slate-200 dark:border-gray-700 flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    View Full Statement
                </button>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={payouts}
            loading={loading}
            resourceName="Payout"
            resourceNamePlural="Payouts"
            selectedItem={selectedPayout}
            onSelectItem={setSelectedPayout}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Details' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => handleOpenModal()}
            searchFields={['vendor', 'id']}
        />
    );
};
