import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { RowActions } from '@/components/common/RowActions';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { TABS } from '@/config/constants';
import { PromotionDetails } from './PromotionDetails';

const formatDiscount = (promo: any) =>
    promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}% off` : `₹${Number(promo.discountValue || 0).toLocaleString()} off`;

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : '—');

const CodeChip = ({ code, className }: { code: string; className?: string }) => (
    <div className={cn(
        "h-7 px-2 min-w-[40px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0 font-mono tracking-wide",
        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400",
        className
    )}>
        <span className="text-[12px] leading-none font-sans">🎟️</span>
        {code}
    </div>
);

export const PromotionsSplitView = ({
    promotions,
    selectedPromotion,
    setSelectedPromotion,
    handleOpenModal,
    handleDeleteClick,
    updatePromotion,
    loading
}: any) => {

    // Only the status changes inline from the table; everything else is sent unchanged.
    const toPayload = (promo: any, overrides: any) => ({
        code: promo.code,
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        maxDiscountAmount: promo.maxDiscountAmount,
        minBookingAmount: promo.minBookingAmount,
        validFrom: promo.validFrom ? promo.validFrom.split('T')[0] : '',
        validTo: promo.validTo ? promo.validTo.split('T')[0] : '',
        usageLimit: promo.usageLimit,
        isActive: promo.isActive,
        ...overrides,
    });

    const columns = [
        {
            header: 'Promotion',
            accessorKey: 'code',
            className: 'w-[40%] min-w-[220px] px-3 text-left font-semibold text-slate-900 dark:text-white',
            render: (promo: any) => (
                <div className="flex items-center gap-3">
                    <CodeChip code={promo.code} />
                    <div className="min-w-0">
                        <div className="font-semibold text-[13.5px] text-slate-800 dark:text-slate-100 leading-tight truncate">{promo.name || '-'}</div>
                        {promo.description && <p className="text-xs text-slate-500 font-normal truncate mt-0.5 max-w-[250px]">{promo.description}</p>}
                    </div>
                </div>
            )
        },
        {
            header: 'Discount',
            accessorKey: 'discountValue',
            className: 'w-[15%] min-w-[110px] px-3 text-left',
            render: (promo: any) => <span className="font-medium text-slate-700 dark:text-slate-300">{formatDiscount(promo)}</span>
        },
        {
            header: 'Valid Till',
            accessorKey: 'validTo',
            className: 'w-[15%] min-w-[110px] px-3 text-left text-slate-500 dark:text-slate-400',
            render: (promo: any) => formatDate(promo.validTo)
        },
        {
            header: 'Usage Limit',
            accessorKey: 'usageLimit',
            className: 'w-[12%] min-w-[100px] px-3 text-left text-slate-500 dark:text-slate-400',
            render: (promo: any) => promo.usageLimit ? `${promo.usageLimit} uses` : 'Unlimited'
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[10%] min-w-[110px] px-3 text-left',
            render: (promo: any) => (
                <EditableStatusBadge
                    status={promo.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={(val) => updatePromotion(promo.id, toPayload(promo, { isActive: val === 'Active' }))}
                />
            )
        },
        {
            header: '',
            preventRowClick: true,
            className: 'w-[8%] min-w-[80px] px-3 text-right',
            render: (promo: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(promo)}
                        onDelete={() => handleDeleteClick(promo.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((promo: any, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                isSelected
                    ? "bg-[var(--accent-light)]"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-0 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-[var(--accent)] opacity-100" : "opacity-0"
            )} />
            <CodeChip code={promo.code} className="ml-1" />
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                    isSelected ? "text-[var(--accent)]" : "text-slate-900 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>
                    {promo.name || formatDiscount(promo)}
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {formatDiscount(promo)} · till {formatDate(promo.validTo)}
                    </p>
                    <div className={cn(
                        "w-2 h-2 rounded-full shrink-0 shadow-sm",
                        promo.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    )} />
                </div>
            </div>
        </div>
    ), []);

    const renderDetailsPanel = useCallback((promo: any, activeTab: string, dirtyState: any) => {
        if (activeTab !== TABS.GENERAL.id) return null;
        return (
            <div className="pt-2">
                <PromotionDetails
                    promotion={promo}
                    updatePromotion={updatePromotion}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            </div>
        );
    }, [updatePromotion]);

    const customFilter = useCallback((promo: any, activeFilters: Record<string, string[]>) => {
        if (activeFilters.status && activeFilters.status.length > 0) {
            return activeFilters.status.includes(promo.isActive ? 'true' : 'false');
        }
        return true;
    }, []);

    const customSearch = useCallback((promo: any, search: string) => {
        const s = search.toLowerCase();
        return Boolean(promo.code?.toLowerCase().includes(s) || promo.name?.toLowerCase().includes(s));
    }, []);

    return (
        <CrudSplitViewLayout
            data={promotions || []}
            loading={loading}
            resourceName="Promotion"
            resourceNamePlural="Promotions"
            selectedItem={selectedPromotion}
            onSelectItem={setSelectedPromotion}
            columns={columns}
            keyExtractor={(promo: any) => promo.id}
            renderListItem={renderListItem}
            tabs={[{ id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort }]}
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
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            emptyStateIcon="🎟️"
            onAdd={() => handleOpenModal()}
        />
    );
};
