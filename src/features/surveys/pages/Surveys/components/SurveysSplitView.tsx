import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ClipboardList, PieChart, Users, Calendar, ArrowRight, Share2, BarChart3, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SurveysSplitViewProps {
    surveys: any[];
    selectedSurvey: any | null;
    setSelectedSurvey: (item: any | null) => void;
    handleOpenModal: (item?: any) => void;
    loading: boolean;
}

export const SurveysSplitView: React.FC<SurveysSplitViewProps> = ({
    surveys,
    selectedSurvey,
    setSelectedSurvey,
    handleOpenModal,
    loading
}) => {
    const columns = [
        {
            header: 'Survey Name',
            accessorKey: 'title',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.id}</span>
                </div>
            )
        },
        {
            header: 'Responses',
            accessorKey: 'responses',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{item.responses.toLocaleString()}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Active' ? 'success' : item.status === 'Draft' ? 'warning' : 'neutral'} 
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
                <ClipboardList size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.title}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.responses} responses • {item.endDate}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Active' ? 'success' : 'warning'} 
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
                        <div className="w-14 h-14 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-800/20">
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.title}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.id}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Active' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-gray-700">
                        <Share2 size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 dark:bg-slate-950 p-4 rounded-xl text-white shadow-xl shadow-slate-200/50 dark:shadow-none col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Completion Rate</p>
                            <span className="text-[12px] text-emerald-400 font-black">84%</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black italic">{item.responses.toLocaleString()}</span>
                            <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">Responses</span>
                        </div>
                        <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '84%' }} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Survey Summary</h3>
                    <div className="bg-white dark:bg-[#0f1117] rounded-lg border border-slate-200 dark:border-gray-800/60 overflow-hidden">
                        {[
                            { label: 'Total Questions', value: '12', icon: ClipboardList },
                            { label: 'Avg. Finish Time', value: '4m 20s', icon: Clock },
                            { label: 'Active Since', value: item.date, icon: Calendar },
                            { label: 'Expiry Date', value: item.endDate, icon: Calendar },
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

                <button className="w-full py-3 rounded-lg bg-indigo-600 dark:bg-indigo-500 font-black text-[13px] text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2">
                    <PieChart size={16} />
                    View Detailed Analytics
                    <ArrowRight size={16} />
                </button>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={surveys}
            loading={loading}
            resourceName="Survey"
            resourceNamePlural="Surveys"
            selectedItem={selectedSurvey}
            onSelectItem={setSelectedSurvey}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Analysis' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => handleOpenModal()}
            searchFields={['title', 'id']}
        />
    );
};
