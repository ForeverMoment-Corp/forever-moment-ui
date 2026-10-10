import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Bell, Mail, MessageSquare, Phone, RotateCw, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NotificationsSplitViewProps {
    notifications: any[];
    selectedNotification: any | null;
    setSelectedNotification: (item: any | null) => void;
    loading: boolean;
}

export const NotificationsSplitView: React.FC<NotificationsSplitViewProps> = ({
    notifications,
    selectedNotification,
    setSelectedNotification,
    loading
}) => {
    const columns = [
        {
            header: 'Notification',
            accessorKey: 'title',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500">
                        {item.type === 'Email' ? <Mail size={16} /> : 
                         item.type === 'SMS' ? <MessageSquare size={16} /> : <Bell size={16} />}
                    </div>
                    <div>
                        <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-medium truncate w-40">{item.message}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Recipient',
            accessorKey: 'recipient',
            render: (item: any) => (
                <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400">{item.recipient}</span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={
                        item.status === 'Sent' ? 'success' : 
                        item.status === 'Pending' ? 'warning' : 
                        item.status === 'Failed' ? 'error' : 'neutral'
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
                {item.type === 'Email' ? <Mail size={20} /> : <MessageSquare size={20} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.title}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.recipient} • {item.date}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Sent' ? 'success' : 'warning'} 
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
                        <div className="w-14 h-14 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100/50 dark:border-blue-800/20">
                            <Bell size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">Notification Details</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md whitespace-nowrap">{item.id}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Sent' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-gray-700">
                            <RotateCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-gray-900/40 p-4 rounded-xl border border-slate-100 dark:border-gray-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-gray-700">
                                <Phone size={14} />
                            </div>
                            <span className="text-[14px] font-black text-slate-700 dark:text-slate-200">{item.recipient}</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                    </div>
                    
                    <div className="space-y-3">
                        {[
                            { label: 'Subject', value: item.title },
                            { label: 'Channel', value: item.type },
                            { label: 'Sent At', value: item.date },
                        ].map((info, i) => (
                            <div key={i} className="flex justify-between items-center text-[13px]">
                                <span className="font-bold text-slate-400">{info.label}</span>
                                <span className="font-black text-slate-700 dark:text-slate-200">{info.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-gray-700">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Message Body</p>
                        <p className="text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed italic bg-white dark:bg-gray-950 p-3 rounded-lg border border-slate-200 dark:border-gray-800">
                            {item.message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 py-3.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[13px] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <Eye size={16} />
                        View Live Preview
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={notifications}
            loading={loading}
            resourceName="Notification"
            resourceNamePlural="Notifications"
            selectedItem={selectedNotification}
            onSelectItem={setSelectedNotification}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Message' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => {}}
            searchFields={['title', 'recipient', 'id']}
        />
    );
};
