import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FileText, Download, Printer, Mail, MoreVertical, CreditCard, Calendar, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InvoicesSplitViewProps {
    invoices: any[];
    selectedInvoice: any | null;
    setSelectedInvoice: (item: any | null) => void;
    loading: boolean;
}

export const InvoicesSplitView: React.FC<InvoicesSplitViewProps> = ({
    invoices,
    selectedInvoice,
    setSelectedInvoice,
    loading
}) => {
    const columns = [
        {
            header: 'Invoice #',
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
                    variant={item.status === 'Paid' ? 'success' : item.status === 'Overdue' ? 'error' : 'warning'} 
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
                <FileText size={20} />
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
                variant={item.status === 'Paid' ? 'success' : item.status === 'Overdue' ? 'error' : 'warning'} 
                className="scale-75 origin-right"
            />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((item: any) => {
        if (!item) return null;
        return (
            <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.id}</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md whitespace-nowrap">{item.date}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Paid' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-gray-900/40 rounded-xl p-4 border border-slate-100 dark:border-gray-800 space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-gray-800 pb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed To</p>
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white">{item.customer}</h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400">ankit.shukla@example.com</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white">{item.date}</h3>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-slate-200 dark:border-gray-800">
                            <div className="w-10 h-6 bg-slate-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                <CreditCard size={14} className="text-slate-400" />
                            </div>
                            <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">Visa ending in •••• 4242</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
                        <div className="flex justify-between items-center bg-slate-900 dark:bg-white p-3 rounded-lg text-white dark:text-slate-900">
                            <span className="text-[13px] font-bold uppercase tracking-wider">Total Amount</span>
                            <span className="text-xl font-black italic">{item.amount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 py-3.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 font-black text-[13px] hover:bg-slate-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                        <Download size={16} />
                        Download PDF
                    </button>
                    <button className="p-3.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-95">
                        <Printer size={16} />
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={invoices}
            loading={loading}
            resourceName="Invoice"
            resourceNamePlural="Invoices"
            selectedItem={selectedInvoice}
            onSelectItem={setSelectedInvoice}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Invoice Summary' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => {}}
            searchFields={['id', 'customer']}
        />
    );
};
