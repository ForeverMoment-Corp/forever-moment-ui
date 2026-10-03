import { useCallback } from 'react';
import { FaqDetails } from './FaqDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { ITEM_ID_PREFIX } from '@/config/constants';
import type { FaqPayload } from '@/features/faq/store/api';
import type { FaqType } from './Faq';

interface FaqSplitViewProps {
    faqs: FaqType[];
    loading: boolean;
    selectedFaq: FaqType | null;
    setSelectedFaq: (faq: FaqType | null) => void;
    handleOpenModal: (faq?: FaqType | null) => void;
    handleDeleteClick: (id: number) => void;
    handleToggleActive: (faq: FaqType) => void;
    handleDragReorder: (newOrder: FaqType[]) => void;
    updateFaq: (id: number, data: FaqPayload) => Promise<any>;
}

const IdBadge = ({ id, className }: { id: number; className?: string }) => (
    <div className={cn(
        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400",
        className
    )}>
        <span className="text-[12px] leading-none">❓</span>
        {`${ITEM_ID_PREFIX}-${id}`}
    </div>
);

export const FaqSplitView = ({
    faqs,
    loading,
    selectedFaq,
    setSelectedFaq,
    handleOpenModal,
    handleDeleteClick,
    handleToggleActive,
    handleDragReorder,
    updateFaq
}: FaqSplitViewProps) => {

    const columns = [
        {
            header: 'Question',
            accessorKey: 'question',
            className: 'w-[35%] min-w-[220px] px-3 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (faq: FaqType) => (
                <div className="flex items-center gap-3">
                    <IdBadge id={faq.id} />
                    <div className="truncate max-w-[360px]" title={faq.question}>
                        {faq.question || '-'}
                    </div>
                </div>
            )
        },
        {
            header: 'Answer',
            className: 'w-[35%] min-w-[220px] px-3 text-left text-slate-500 dark:text-slate-400',
            render: (faq: FaqType) => (
                <div className="truncate max-w-[360px]" title={faq.answer}>
                    {faq.answer || '-'}
                </div>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[120px] px-3 text-left',
            render: (faq: FaqType) => (
                <EditableStatusBadge
                    status={faq.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={(val) => {
                        if ((val === 'Active') !== faq.isActive) {
                            handleToggleActive(faq);
                        }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] px-3 text-right',
            render: (faq: FaqType) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(faq)}
                        onDelete={() => handleDeleteClick(faq.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((faq: FaqType, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group",
                isSelected
                    ? "bg-[var(--accent-light)]"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-[var(--accent)] opacity-100" : "opacity-0"
            )} />
            <IdBadge id={faq.id} className="min-w-[40px] ml-1" />
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                    isSelected ? "text-[var(--accent)]" : "text-slate-900 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{faq.question || "No question"}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {faq.answer}
                </div>
            </div>
            <div className={cn(
                "w-2 h-2 rounded-full shrink-0 shadow-sm",
                faq.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            )} />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((faq: FaqType, activeTab: string, dirtyState: any) => {
        if (activeTab === "general") {
            return (
                <div className="pt-2">
                    <FaqDetails
                        faq={faq}
                        updateFaq={updateFaq}
                        onDirtyChange={dirtyState.handleDirtyChange}
                    />
                </div>
            );
        }
        return null;
    }, [updateFaq]);

    const customFilter = useCallback((faq: FaqType, activeFilters: Record<string, string[]>) => {
        if (activeFilters.status && activeFilters.status.length > 0) {
            return activeFilters.status.includes(faq.isActive ? 'true' : 'false');
        }
        return true;
    }, []);

    const customSearch = useCallback((faq: FaqType, search: string) => {
        const s = search.toLowerCase();
        return Boolean(
            faq.question?.toLowerCase().includes(s) ||
            faq.answer?.toLowerCase().includes(s)
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={faqs || []}
            loading={loading}
            resourceName="FAQ"
            resourceNamePlural="FAQs"
            selectedItem={selectedFaq}
            onSelectItem={setSelectedFaq}
            columns={columns}
            keyExtractor={(item: FaqType) => item.id}
            onDragReorder={handleDragReorder}
            renderListItem={renderListItem}
            tabs={[{ id: "general", label: "General Info" }]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
                {
                    id: 'status',
                    name: 'Status',
                    options: [
                        { id: '1', label: 'Active', value: 'true' },
                        { id: '2', label: 'Inactive', value: 'false' },
                    ]
                }
            ]}
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
            emptyStateIcon="❓"
        />
    );
};
