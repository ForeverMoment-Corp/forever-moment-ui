import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Check } from 'lucide-react';

interface BulkTimeSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    slots: any[];
    existingTimeSlotIds: number[];
    onSubmit: (data: any) => void;
}

export const BulkTimeSlotModal: React.FC<BulkTimeSlotModalProps> = ({
    isOpen,
    onClose,
    slots,
    existingTimeSlotIds,
    onSubmit
}) => {
    const [selectedSlotIds, setSelectedSlotIds] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        priceOverride: 0,
        maxCapacity: 0,
        validFrom: '',
        validTo: '',
        isActive: true
    });

    const availableSlots = slots.filter(s => !existingTimeSlotIds.includes(s.id));

    const toggleSlotSelection = (id: number) => {
        setSelectedSlotIds(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedSlotIds.length === availableSlots.length) {
            setSelectedSlotIds([]);
        } else {
            setSelectedSlotIds(availableSlots.map(s => s.id));
        }
    };

    const handleFormSubmit = () => {
        if (selectedSlotIds.length === 0) return;

        const payload = {
            items: selectedSlotIds.map(id => ({
                ...formData,
                timeSlotId: id,
                priceOverride: Number(formData.priceOverride),
                maxCapacity: Number(formData.maxCapacity),
                validFrom: formData.validFrom || new Date().toISOString().split('T')[0],
                validTo: formData.validTo || new Date().toISOString().split('T')[0],
            }))
        };

        onSubmit(payload);
        // Reset state after submit
        setSelectedSlotIds([]);
        setFormData({
            priceOverride: 0,
            maxCapacity: 0,
            validFrom: '',
            validTo: '',
            isActive: true
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Bulk Associate Time Slots"
            className="max-w-xl w-[95vw]"
        >
            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Select Time Slots ({selectedSlotIds.length} selected)
                        </label>
                        <button 
                            onClick={handleSelectAll}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                        >
                            {selectedSlotIds.length === availableSlots.length ? 'Deselect All' : 'Select All Available'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-100 dark:border-gray-800 rounded-lg">
                        {availableSlots.map((s: any) => (
                            <button
                                key={s.id}
                                onClick={() => toggleSlotSelection(s.id)}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                                    selectedSlotIds.includes(s.id)
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                                        : 'bg-white border-slate-200 text-slate-600 dark:bg-gray-900 dark:border-gray-800 dark:text-slate-400 hover:border-blue-200'
                                }`}
                            >
                                <span className="truncate">{s.label}</span>
                                {selectedSlotIds.includes(s.id) && <Check size={14} className="shrink-0" />}
                            </button>
                        ))}
                        {availableSlots.length === 0 && (
                            <div className="col-span-full py-4 text-center text-slate-400 text-xs italic">
                                All time slots are already associated with this location.
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Price Override (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                            value={formData.priceOverride}
                            onChange={(e) => setFormData(prev => ({ ...prev, priceOverride: Number(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Max Capacity
                        </label>
                        <input
                            type="number"
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                            value={formData.maxCapacity}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Valid From
                        </label>
                        <input
                            type="date"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.validFrom}
                            onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Valid To
                        </label>
                        <input
                            type="date"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={formData.validTo}
                            onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="ts-isActive-bulk"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="ts-isActive-bulk" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Is Active
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFormSubmit}
                        disabled={selectedSlotIds.length === 0 || !formData.validFrom || !formData.validTo}
                    >
                        Bulk Associate
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
