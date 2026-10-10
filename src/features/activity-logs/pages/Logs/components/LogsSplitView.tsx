import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Activity, User, Shield, Globe, Clock, Server, Terminal, Monitor, Database } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogsSplitViewProps {
    logs: any[];
    selectedLog: any | null;
    setSelectedLog: (item: any | null) => void;
    loading: boolean;
}

export const LogsSplitView: React.FC<LogsSplitViewProps> = ({
    logs,
    selectedLog,
    setSelectedLog,
    loading
}) => {
    const columns = [
        {
            header: 'Action',
            accessorKey: 'action',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        item.severity === 'Critical' ? "bg-rose-100 text-rose-600" : 
                        item.severity === 'Warning' ? "bg-amber-100 text-amber-600" : 
                        "bg-slate-100 text-slate-600"
                    )}>
                        <Terminal size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.action}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.id}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'User',
            accessorKey: 'user',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-400">{item.user}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Success' ? 'success' : item.status === 'Failed' ? 'error' : 'neutral'} 
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
                <Activity size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.action}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.user} • {item.date}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Success' ? 'success' : 'error'} 
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
                        <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-900 dark:text-white shadow-xl shadow-slate-200 dark:shadow-none border border-slate-200/50 dark:border-gray-700/50">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">Security Audit Log</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md whitespace-nowrap">{item.id}</span>
                                <StatusBadge status={item.severity} variant={item.severity === 'Critical' ? 'error' : item.severity === 'Warning' ? 'warning' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-white font-mono text-[12.5px] relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 text-white/5 group-hover:text-white/10 transition-all pointer-events-none">
                        <Database size={100} />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <p className="text-indigo-400 font-bold">// Raw Metadata Payload</p>
                        <p>{"{"}</p>
                        <p className="pl-3"><span className="text-slate-400">"action":</span> <span className="text-emerald-400">"{item.action}"</span>,</p>
                        <p className="pl-3"><span className="text-slate-400">"actor":</span> <span className="text-emerald-400">"{item.user}"</span>,</p>
                        <p className="pl-3"><span className="text-slate-400">"timestamp":</span> <span className="text-amber-400">"{item.date}"</span>,</p>
                        <p className="pl-3"><span className="text-slate-400">"origin":</span> <span className="text-emerald-400">"192.168.1.1"</span>,</p>
                        <p className="pl-3"><span className="text-slate-400">"status":</span> <span className="text-emerald-400">"{item.status}"</span></p>
                        <p>{"}"}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Session context</h3>
                    <div className="bg-white dark:bg-[#0f1117] rounded-lg border border-slate-200 dark:border-gray-800/60 overflow-hidden shadow-sm">
                        {[
                            { label: 'Device / Browser', value: 'Chrome v122 (macOS)', icon: Monitor },
                            { label: 'IP Address', value: '192.168.1.1', icon: Globe },
                            { label: 'Server Node', value: 'API-Cluster-East', icon: Server },
                            { label: 'Latency', value: '42ms', icon: Clock },
                        ].map((info, i) => (
                            <div key={i} className="px-3 py-3 flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-gray-800/40">
                                <div className="flex items-center gap-3">
                                    <info.icon size={16} className="text-slate-400" />
                                    <span className="text-[13px] font-bold text-slate-400">{info.label}</span>
                                </div>
                                <span className="text-[13.5px] font-black text-slate-700 dark:text-slate-200">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button className="w-full py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[13px] hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                        View Full Trace Logs
                        <Terminal size={16} />
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={logs}
            loading={loading}
            resourceName="Log Entry"
            resourceNamePlural="Activity Logs"
            selectedItem={selectedLog}
            onSelectItem={setSelectedLog}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Metadata' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => {}}
            searchFields={['action', 'user', 'id']}
        />
    );
};
