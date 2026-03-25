import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { RowActions } from '@/components/common/RowActions';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Ticket } from 'lucide-react';

export const PromotionsSplitView = ({
    promotions,
    selectedPromotion,
    setSelectedPromotion,
    handleOpenModal,
    handleDeleteClick,
    loading
}: any) => {

    const columns = [
        {
            header: 'Coupon Code',
            accessorKey: 'code',
            className: 'w-[25%] min-w-[150px] py-3 px-4 text-left font-bold text-slate-900 dark:text-white',
            render: (promo: any) => (
                <div className="flex items-center gap-2">
                    <span className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800 px-3 py-1 rounded-lg font-mono text-[12px] font-black tracking-wider">
                        {promo.code}
                    </span>
                </div>
            )
        },
        {
            header: 'Discount',
            accessorKey: 'value',
            className: 'w-[20%] min-w-[120px] py-3 px-4 text-left font-semibold text-slate-700 dark:text-slate-200',
            render: (promo: any) => promo.type === 'Percentage' ? `${promo.value}% Off` : `₹${promo.value} Off`
        },
        {
            header: 'Usage',
            accessorKey: 'usageCount',
            className: 'w-[15%] min-w-[100px] py-3 px-4 text-left text-slate-500 dark:text-slate-400',
            render: (promo: any) => `${promo.usageCount} times`
        },
        {
            header: 'Status',
            accessorKey: 'status',
            className: 'w-[15%] min-w-[100px] py-3 px-4 text-left',
            render: (promo: any) => (
                <StatusBadge 
                    status={promo.status} 
                    activeValue="Active"
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[25%] min-w-[100px] py-3 px-4 text-right',
            render: (promo: any) => (
                <RowActions
                    onEdit={() => handleOpenModal(promo)}
                    onDelete={() => handleDeleteClick(promo.id)}
                />
            )
        }
    ];

    const renderListItem = useCallback((promo: any, isSelected: boolean) => {
        return (
            <div
                className={cn(
                    "flex flex-col p-4 mb-2 cursor-pointer transition-all duration-200 rounded-xl relative overflow-hidden border",
                    isSelected
                        ? "bg-[var(--accent-light)] border-[var(--accent)] shadow-sm"
                        : "bg-white dark:bg-gray-900 border-slate-100 dark:border-gray-800 hover:border-slate-200 dark:hover:border-gray-700"
                )}
            >
                <div className="flex justify-between items-center mb-2">
                    <span className={cn(
                        "font-black text-[13px] font-mono tracking-tight",
                        isSelected ? "text-[var(--accent)]" : "text-slate-900 dark:text-white"
                    )}>{promo.code}</span>
                    <Ticket size={14} className={isSelected ? "text-[var(--accent)]" : "text-slate-300 dark:text-gray-600"} />
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                             {promo.type === 'Percentage' ? `${promo.value}% Off` : `₹${promo.value} Off`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Expires {promo.expiryDate}</div>
                    </div>
                    <div className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                        promo.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    )}>
                        {promo.status}
                    </div>
                </div>
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((promo: any) => {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-400 to-rose-500 p-8 rounded-3xl text-white shadow-xl shadow-orange-500/20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                        <Ticket size={32} />
                    </div>
                    <div className="text-4xl font-black mb-1 font-mono tracking-tighter uppercase">{promo.code}</div>
                    <p className="text-white/80 font-bold mb-4">{promo.type === 'Percentage' ? `${promo.value}% DISCOUNT` : `₹${promo.value} DISCOUNT`}</p>
                    <div className="w-full h-px bg-white/20 my-4" />
                    <div className="grid grid-cols-2 w-full gap-4">
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Times Used</div>
                            <div className="text-lg font-black">{promo.usageCount}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Min. Spend</div>
                            <div className="text-lg font-black">₹{promo.minSpend}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Campaign Statistics</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Target Spend Level</span>
                            <span className="font-bold text-slate-900 dark:text-white">₹{promo.minSpend.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Expiry Date</span>
                            <span className="font-bold text-slate-900 dark:text-white">{promo.expiryDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Current Conversion</span>
                            <span className="font-bold text-emerald-500">{(promo.usageCount / 10).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={promotions}
            loading={loading}
            resourceName="Promotion"
            resourceNamePlural="Promotions"
            selectedItem={selectedPromotion}
            onSelectItem={setSelectedPromotion}
            columns={columns}
            keyExtractor={(promo: any) => promo.id}
            renderListItem={renderListItem}
            renderDetailsPanel={renderDetailsPanel}
            searchFields={['code']}
            emptyStateIcon="🎟️"
        />
    );
};
