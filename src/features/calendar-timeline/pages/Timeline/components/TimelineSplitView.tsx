import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle, CalendarDays, History } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TimelineSplitViewProps {
    events: any[];
    selectedEvent: any | null;
    setSelectedEvent: (item: any | null) => void;
    loading: boolean;
}

export const TimelineSplitView: React.FC<TimelineSplitViewProps> = ({
    events,
    selectedEvent,
    setSelectedEvent,
    loading
}) => {
    const columns = [
        {
            header: 'Event',
            accessorKey: 'title',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-slate-400" />
                        <span className="text-[11px] text-slate-400 font-medium">{item.time}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Resource',
            accessorKey: 'resource',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-400">{item.resource}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Confirmed' ? 'success' : item.status === 'Tentative' ? 'warning' : 'neutral'} 
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
                <CalendarDays size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.title}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.time} • {item.resource}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Confirmed' ? 'success' : 'warning'} 
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
                            <Clock size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">Event Schedule</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md whitespace-nowrap">{item.time}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Confirmed' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-gray-900/40 rounded-xl p-4 border border-slate-100 dark:border-gray-800 space-y-3">
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-gray-800 pb-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-slate-200 dark:border-gray-700">
                            <Calendar size={18} className="text-slate-400" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Duration</p>
                            <p className="text-[14px] font-black text-slate-900 dark:text-white">{item.date} (90 mins)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border border-slate-200 dark:border-gray-800">
                            <MapPin size={18} className="text-slate-400" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Room</p>
                            <p className="text-[14px] font-black text-slate-900 dark:text-white">Studio Alpha • Room 102</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Scheduled Resources</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: item.resource, role: 'Technician', status: 'Online' },
                            { name: 'Backup Team A', role: 'Support', status: 'On Call' },
                        ].map((resource, i) => (
                            <div key={i} className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-800 shadow-sm grow">
                                <p className="text-[13.5px] font-black text-slate-700 dark:text-slate-200">{resource.name}</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">{resource.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-3">
                    <button className="flex-1 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[13px] hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                        Modify Event
                    </button>
                    <button className="px-4 py-3 rounded-lg bg-rose-50 text-rose-600 font-black text-[13px] hover:bg-rose-100 transition-all border border-rose-100">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={events}
            loading={loading}
            resourceName="Event"
            resourceNamePlural="Calendar"
            selectedItem={selectedEvent}
            onSelectItem={setSelectedEvent}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Schedule Info' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => {}}
            searchFields={['title', 'resource', 'id']}
        />
    );
};
