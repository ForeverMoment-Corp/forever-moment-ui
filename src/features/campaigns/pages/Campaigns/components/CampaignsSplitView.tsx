import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Megaphone, Target, Users, Calendar, ArrowUpRight, BarChart3, Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CampaignsSplitViewProps {
    campaigns: any[];
    selectedCampaign: any | null;
    setSelectedCampaign: (item: any | null) => void;
    handleOpenModal: (item?: any) => void;
    loading: boolean;
}

export const CampaignsSplitView: React.FC<CampaignsSplitViewProps> = ({
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    handleOpenModal,
    loading
}) => {
    const columns = [
        {
            header: 'Campaign',
            accessorKey: 'name',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                        {item.type === 'Email' ? <Mail size={16} /> : <Megaphone size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.id}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Target Audience',
            accessorKey: 'audience',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Target size={14} className="text-slate-400" />
                    <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-400">{item.audience}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Running' ? 'success' : item.status === 'Paused' ? 'warning' : 'neutral'} 
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
                {item.type === 'Email' ? <Mail size={20} /> : <Megaphone size={20} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.audience} • {item.budget}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Running' ? 'success' : 'warning'} 
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
                            <Megaphone size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.id}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Running' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reach</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">45.2k</span>
                            <span className="text-[11px] text-emerald-500 font-bold">+12%</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-slate-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversions</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">1,284</span>
                            <span className="text-[11px] text-emerald-500 font-bold">+8%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Campaign Settings</h3>
                    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800/60 overflow-hidden">
                        {[
                            { label: 'Platform', value: item.type, icon: MessageSquare },
                            { label: 'Audience', value: item.audience, icon: Users },
                            { label: 'Budget', value: item.budget, icon: BarChart3 },
                            { label: 'Start Date', value: item.date, icon: Calendar },
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

                <button className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[13px] hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                    <ArrowUpRight size={18} />
                    View performance report
                </button>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={campaigns}
            loading={loading}
            resourceName="Campaign"
            resourceNamePlural="Campaigns"
            selectedItem={selectedCampaign}
            onSelectItem={setSelectedCampaign}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Overview' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => handleOpenModal()}
            searchFields={['name', 'audience', 'id']}
        />
    );
};
