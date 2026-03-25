import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LifeBuoy, MessageSquare, User, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HelpdeskSplitViewProps {
    tickets: any[];
    selectedTicket: any | null;
    setSelectedTicket: (item: any | null) => void;
    handleOpenModal: (item?: any) => void;
    loading: boolean;
}

export const HelpdeskSplitView: React.FC<HelpdeskSplitViewProps> = ({
    tickets,
    selectedTicket,
    setSelectedTicket,
    handleOpenModal,
    loading
}) => {
    const columns = [
        {
            header: 'Subject',
            accessorKey: 'subject',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.subject}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.id}</span>
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
            header: 'Priority',
            accessorKey: 'priority',
            render: (item: any) => (
                <StatusBadge 
                    status={item.priority} 
                    variant={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'neutral'} 
                />
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Open' ? 'info' : item.status === 'Resolved' ? 'success' : 'neutral'} 
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
                <MessageSquare size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.subject}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.customer} • {item.lastUpdate}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Open' ? 'info' : 'success'} 
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
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm border border-orange-100/50 dark:border-orange-800/20">
                            <LifeBuoy size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.subject}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.id}</span>
                                <StatusBadge status={item.priority} variant={item.priority === 'High' ? 'error' : 'warning'} />
                                <StatusBadge status={item.status} variant={item.status === 'Open' ? 'info' : 'success'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-100 dark:border-gray-800 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                        <p className="text-[14px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            {item.customer}
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-100 dark:border-gray-800 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technician</p>
                        <p className="text-[14px] font-bold text-slate-700 dark:text-slate-200">
                            {item.assignee}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Conversation History</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                                {item.customer.charAt(0)}
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-gray-800 shadow-sm grow">
                                <p className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    "I am unable to access my package details in the dashboard. It keeps showing a loading spinner. Can you please check?"
                                </p>
                                <span className="text-[10px] font-bold text-slate-400 mt-2 block">{item.lastUpdate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group pt-4">
                    <textarea 
                        className="w-full h-32 bg-slate-50 dark:bg-gray-900/60 rounded-2xl border border-slate-200 dark:border-gray-800 p-4 text-[13.5px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                        placeholder="Type your response here..."
                    />
                    <button className="absolute bottom-4 right-4 p-3 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={tickets}
            loading={loading}
            resourceName="Ticket"
            resourceNamePlural="Tickets"
            selectedItem={selectedTicket}
            onSelectItem={setSelectedTicket}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Ticket Activity' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => handleOpenModal()}
            searchFields={['subject', 'customer', 'id']}
        />
    );
};
