import React, { useEffect, useMemo, useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { Ticket, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';

export interface ExperienceCoupon {
    couponId: number;
    code: string;
    description?: string;
    discountType?: string;
    discountValue?: number;
    isActive?: boolean;
}

interface PromotionsTabProps {
    experienceId: number;
    availablePromotions: any[]; // All master coupons in the system
    experiencePromotions: ExperienceCoupon[];
    loading?: boolean;
    getExperiencePromotions?: (experienceId: number) => Promise<any>;
    onTogglePromotion: (couponId: number, isAssociate: boolean) => void;
}

const formatPrice = (value?: number | null) =>
    value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export const PromotionsTab: React.FC<PromotionsTabProps> = ({
    experienceId,
    availablePromotions,
    experiencePromotions,
    loading = false,
    getExperiencePromotions,
    onTogglePromotion
}) => {
    const [search, setSearch] = useState("");
    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

    useEffect(() => {
        if (experienceId && getExperiencePromotions) {
            getExperiencePromotions(experienceId).catch(() => { /* error surfaced via store */ });
        }
    }, [experienceId, getExperiencePromotions]);

    const filteredAssignedPromotions = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (experiencePromotions || []).filter((ec) => !q || ec.code?.toLowerCase().includes(q) || ec.description?.toLowerCase().includes(q));
    }, [experiencePromotions, search]);

    const handleOpenAssocModal = () => {
        setSelectedCouponId(null);
        setIsAssocModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssocModalOpen(false);
        setSelectedCouponId(null);
    };

    const handleSubmit = () => {
        if (!selectedCouponId) return;
        onTogglePromotion(selectedCouponId, true);
        handleCloseModal();
    };

    // Filter available promotions down to those that are active and not already assigned
    const unassignedPromotions = (availablePromotions || []).filter((promo: any) =>
        promo.isActive && !experiencePromotions?.some((ec: any) => String(ec.couponId || ec.id || ec.coupon?.id) === String(promo.id))
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <SearchBar
                    className="flex-1"
                    inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    placeholder="Search promotions..."
                    value={search}
                    onChange={setSearch}
                />
                <Button onClick={handleOpenAssocModal} className="h-10 px-3 text-sm shrink-0">
                    Associate Promotion
                </Button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 pb-20">
                {loading && filteredAssignedPromotions.length === 0 && (
                    <div className="flex items-center justify-center gap-2 py-5 text-sm text-slate-400">
                        <Loader2 size={16} className="animate-spin" /> Loading promotions…
                    </div>
                )}
                {filteredAssignedPromotions.map((ec: any) => {
                    const id = ec.couponId || ec.id || ec.coupon?.id;
                    return (
                        <div key={id} className="flex flex-col gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-blue-300">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <Ticket size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            {ec.code || ec.coupon?.code}
                                            {(ec.isActive === false || ec.coupon?.isActive === false) && (
                                                <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-gray-800 text-slate-500 px-1.5 py-0.5 rounded-full">Inactive</span>
                                            )}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Discount: <span className="font-semibold text-slate-700 dark:text-slate-200">{(ec.discountType || ec.coupon?.discountType) === 'PERCENTAGE' ? `${ec.discountValue || ec.coupon?.discountValue}%` : formatPrice(ec.discountValue ?? ec.coupon?.discountValue)}</span>
                                        </p>
                                        {(ec.description || ec.coupon?.description) && (
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ec.description || ec.coupon?.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onTogglePromotion(id, false)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Association"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && filteredAssignedPromotions.length === 0 && (
                    <div className="text-center py-6 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <Ticket className="mx-auto h-8 w-8 opacity-20 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No promotions associated.</p>
                        <p className="text-xs mt-1">Click "Associate Promotion" to link one.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                title="Associate New Promotion"
                className="max-w-md w-[95vw]"
            >
                <div className="space-y-3">
                    <div>
                        <Dropdown
                            label="Select Promotion"
                            options={unassignedPromotions.map((promo: any) => ({
                                id: promo.id.toString(),
                                value: promo.id.toString(),
                                label: `${promo.code} (${promo.discountType === 'PERCENTAGE' ? promo.discountValue + '%' : '₹' + promo.discountValue})`
                            }))}
                            value={selectedCouponId ? selectedCouponId.toString() : ''}
                            onChange={(value: string) => setSelectedCouponId(Number(value))}
                            placeholder="-- Select a Promotion --"
                            className="w-full"
                        />
                        {unassignedPromotions.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1.5">No matching active promotions available to assign.</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-gray-800 mt-3">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedCouponId}
                        >
                            Associate
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
