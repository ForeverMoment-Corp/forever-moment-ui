import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Layout, Image, Clock, CheckCircle, Eye, Plus, FileText, Globe, MoveUpRight, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CMSSplitViewProps {
    pages: any[];
    selectedPage: any | null;
    setSelectedPage: (item: any | null) => void;
    handleOpenModal: (item?: any) => void;
    loading: boolean;
}

export const CMSSplitView: React.FC<CMSSplitViewProps> = ({
    pages,
    selectedPage,
    setSelectedPage,
    handleOpenModal,
    loading
}) => {
    const columns = [
        {
            header: 'Page / Slug',
            accessorKey: 'title',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
                    <span className="text-[11px] text-slate-400 font-medium italic">{item.slug}</span>
                </div>
            )
        },
        {
            header: 'Last Modified',
            accessorKey: 'lastModified',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-400">{item.lastModified}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={item.status === 'Published' ? 'success' : item.status === 'Draft' ? 'warning' : 'neutral'} 
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
                )}>{item.title}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate italic">
                    {item.slug} • {item.lastModified}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'Published' ? 'success' : 'warning'} 
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
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none">
                            <Layout size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.title}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.slug}</span>
                                <StatusBadge status={item.status} variant={item.status === 'Published' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-gray-900/40 rounded-3xl p-6 border border-slate-100 dark:border-gray-800 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Title</p>
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white">{item.title} | ForeverMoment</h3>
                        </div>
                        <Globe size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Structure</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Sections', value: '8', icon: Layout },
                                { label: 'Images', value: '12', icon: Image },
                                { label: 'Revision', value: 'v2.4', icon: History },
                                { label: 'Last Edit', value: item.lastModified, icon: Clock },
                            ].map((info, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <info.icon size={12} className="text-slate-400" />
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{info.label}</p>
                                    </div>
                                    <p className="text-[13.5px] font-black text-slate-700 dark:text-slate-200">{info.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[13px] hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                        <Eye size={16} />
                        Preview Content
                    </button>
                    <button 
                        onClick={() => handleOpenModal(item)}
                        className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 font-black text-[13px] hover:bg-slate-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-gray-700"
                    >
                        <Settings size={16} />
                        Edit Page
                    </button>
                </div>
            </div>
        );
    }, [handleOpenModal]);

    return (
        <CrudSplitViewLayout
            data={pages}
            loading={loading}
            resourceName="Page"
            resourceNamePlural="CMS Pages"
            selectedItem={selectedPage}
            onSelectItem={setSelectedPage}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Page Details' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => handleOpenModal()}
            searchFields={['title', 'slug', 'id']}
        />
    );
};
