import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { RowActions } from '@/components/common/RowActions';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Star } from 'lucide-react';

export const ReviewsSplitView = ({
    reviews,
    selectedReview,
    setSelectedReview,
    handleOpenModal,
    handleDeleteClick,
    loading
}: any) => {

    const columns = [
        {
            header: 'Experience',
            accessorKey: 'experienceName',
            className: 'w-[25%] min-w-[150px] px-3 text-left font-bold text-slate-900 dark:text-white',
        },
        {
            header: 'Rating',
            accessorKey: 'rating',
            className: 'w-[15%] min-w-[100px] px-3 text-left font-bold text-orange-500',
            render: (rev: any) => (
                <div className="flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    <span>{rev.rating}/5</span>
                </div>
            )
        },
        {
            header: 'Customer',
            accessorKey: 'customerName',
            className: 'w-[20%] min-w-[150px] px-3 text-left text-slate-600 dark:text-slate-400 font-medium',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            className: 'w-[15%] min-w-[100px] px-3 text-left',
            render: (rev: any) => (
                <StatusBadge 
                    status={rev.status} 
                    activeValue="Approved"
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[25%] min-w-[100px] px-3 text-right',
            render: (rev: any) => (
                <RowActions
                    onEdit={() => handleOpenModal(rev)}
                    onDelete={() => handleDeleteClick(rev.id)}
                />
            )
        }
    ];

    const renderListItem = useCallback((rev: any, isSelected: boolean) => {
        return (
            <div
                className={cn(
                    "flex flex-col p-3 mb-2 cursor-pointer transition-all duration-200 rounded-xl border relative overflow-hidden",
                    isSelected
                        ? "bg-[var(--accent-light)] border-[var(--accent)] shadow-sm"
                        : "bg-white dark:bg-gray-900 border-slate-100 dark:border-gray-800 hover:border-slate-200 dark:hover:border-gray-700"
                )}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                         <span className={cn(
                             "font-bold text-[13.5px] truncate",
                             isSelected ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white group-hover:text-[var(--accent)]"
                         )}>{rev.experienceName}</span>
                         <span className="text-[11px] text-slate-400">{rev.customerName}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-orange-400">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[11px] font-black">{rev.rating}</span>
                    </div>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 italic leading-relaxed">
                    "{rev.comment}"
                </p>
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((rev: any) => {
        return (
            <div className="space-y-3">
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 font-bold text-lg">
                                {rev.customerName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{rev.customerName}</h2>
                                <p className="text-sm text-slate-400 font-medium">Reviewed on {rev.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg text-orange-600 dark:text-orange-400">
                            <Star size={20} fill="currentColor" />
                            <span className="text-2xl font-black">{rev.rating}.0</span>
                        </div>
                    </div>

                    <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                        "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-3">
                         <button className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all">Approve Review</button>
                         <button className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all dark:bg-gray-800 dark:text-slate-300">Reject</button>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-lg border border-dashed border-slate-300 dark:border-gray-700">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Internal Context</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Experience ID</p>
                            <p className="font-bold text-slate-700 dark:text-slate-200">EXP-9021</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Booking Date</p>
                            <p className="font-bold text-slate-700 dark:text-slate-200">2026-03-15</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={reviews}
            loading={loading}
            resourceName="Review"
            resourceNamePlural="Reviews"
            selectedItem={selectedReview}
            onSelectItem={setSelectedReview}
            columns={columns}
            keyExtractor={(rev: any) => rev.id}
            renderListItem={renderListItem}
            renderDetailsPanel={renderDetailsPanel}
            searchFields={['experienceName', 'customerName']}
            emptyStateIcon="⭐"
        />
    );
};
