import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input as TextInput } from '@/components/common/Input';
import { NumberInput } from '@/components/common/NumberInput';
import { Dropdown } from '@/components/common/Dropdown';

interface PromotionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    promo: any;
    onSubmit: (data: any) => void;
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({
    isOpen,
    onClose,
    promo,
    onSubmit
}) => {
    const isEditing = !!promo;
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        maxDiscountAmount: 0,
        minBookingAmount: 0,
        validFrom: '',
        validTo: '',
        usageLimit: 0,
        isActive: true
    });

    useEffect(() => {
        if (promo) {
            setFormData({
                code: promo.code || '',
                name: promo.name || '',
                description: promo.description || '',
                discountType: promo.discountType || 'PERCENTAGE',
                discountValue: promo.discountValue || 0,
                maxDiscountAmount: promo.maxDiscountAmount || 0,
                minBookingAmount: promo.minBookingAmount || 0,
                validFrom: promo.validFrom ? promo.validFrom.split('T')[0] : '',
                validTo: promo.validTo ? promo.validTo.split('T')[0] : '',
                usageLimit: promo.usageLimit || 0,
                isActive: promo.isActive ?? true
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                discountType: 'PERCENTAGE',
                discountValue: 0,
                maxDiscountAmount: 0,
                minBookingAmount: 0,
                validFrom: '',
                validTo: '',
                usageLimit: 0,
                isActive: true
            });
        }
    }, [promo, isOpen]);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Promotion' : 'Create Promotion'}
            className="max-w-2xl w-[95vw]"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
                        <TextInput
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.code}
                            onChange={(e: any) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                            placeholder="e.g. SUMMER20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                        <TextInput
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.name}
                            onChange={(e: any) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Summer Sale"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <TextInput
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                        value={formData.description}
                        onChange={(e: any) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Get 20% off on all summer bookings"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
                        <Dropdown
                            options={[
                                { value: 'PERCENTAGE', label: 'Percentage' },
                                { value: 'FIXED_AMOUNT', label: 'Flat Amount' }
                            ]}
                            value={formData.discountType}
                            onChange={(value: string) => setFormData((prev) => ({ ...prev, discountType: value || 'PERCENTAGE' }))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Value</label>
                        <NumberInput
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.discountValue}
                            onChange={(e: any) => setFormData((prev) => ({ ...prev, discountValue: Number(e.target.value) }))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Discount Amount (₹)</label>
                        <NumberInput
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.maxDiscountAmount}
                            onChange={(e: any) => setFormData((prev) => ({ ...prev, maxDiscountAmount: Number(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Booking Amount (₹)</label>
                        <NumberInput
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.minBookingAmount}
                            onChange={(e: any) => setFormData((prev) => ({ ...prev, minBookingAmount: Number(e.target.value) }))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valid From</label>
                        <input
                            type="date"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.validFrom}
                            onChange={(e) => setFormData((prev) => ({ ...prev, validFrom: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valid To</label>
                        <input
                            type="date"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.validTo}
                            onChange={(e) => setFormData((prev) => ({ ...prev, validTo: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Usage Limit (0 for unlimited)</label>
                        <NumberInput
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.usageLimit}
                            onChange={(e: any) => setFormData((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Active Status</div>
                        <div className="text-xs text-slate-500">Enable or disable this promotion</div>
                    </div>
                    <label className="flex items-center cursor-pointer relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.isActive}
                            onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-gray-800 mt-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.code || !formData.name || !formData.validFrom || !formData.validTo || formData.discountValue <= 0}
                    >
                        {isEditing ? 'Save Changes' : 'Create Promotion'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
