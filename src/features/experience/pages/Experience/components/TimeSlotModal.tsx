import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { Button } from '@/components/common/Button';
import { NumberInput } from '@/components/common/NumberInput';

interface TimeSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    isTsEditing: boolean;
    slots: any[];
    selectedTimeSlotId: number | null;
    setSelectedTimeSlotId: (id: number) => void;
    timeSlotFormData: any;
    setTimeSlotFormData: (data: any) => void;
    onSubmit: () => void;
}

export const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
    isOpen,
    onClose,
    isTsEditing,
    slots,
    selectedTimeSlotId,
    setSelectedTimeSlotId,
    timeSlotFormData,
    setTimeSlotFormData,
    onSubmit
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isTsEditing ? "Update Time Slot" : "Associate Time Slot"}
            className="max-w-md w-[95vw]"
        >
            <div className="space-y-6">
                {!isTsEditing && (
                    <div>
                        <Dropdown
                            label="Select Time Slot"
                            options={slots.map((s: any) => ({
                                id: s.id.toString(),
                                value: s.id.toString(),
                                label: s.label
                            }))}
                            value={selectedTimeSlotId ? selectedTimeSlotId.toString() : ''}
                            onChange={(value: string) => setSelectedTimeSlotId(Number(value))}
                            placeholder="-- Select a Time Slot --"
                            className="w-full"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Price Override (₹)
                        </label>
                        <NumberInput
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                            value={timeSlotFormData.priceOverride}
                            onChange={(e) => setTimeSlotFormData((prev: any) => ({ ...prev, priceOverride: Number(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Max Capacity
                        </label>
                        <NumberInput
                            min="0"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                            value={timeSlotFormData.maxCapacity}
                            onChange={(e) => setTimeSlotFormData((prev: any) => ({ ...prev, maxCapacity: Number(e.target.value) }))}
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
                            value={timeSlotFormData.validFrom}
                            onChange={(e) => setTimeSlotFormData((prev: any) => ({ ...prev, validFrom: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Valid To
                        </label>
                        <input
                            type="date"
                            className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                            value={timeSlotFormData.validTo}
                            onChange={(e) => setTimeSlotFormData((prev: any) => ({ ...prev, validTo: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="ts-isActive"
                        checked={timeSlotFormData.isActive}
                        onChange={(e) => setTimeSlotFormData((prev: any) => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="ts-isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Is Active
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!selectedTimeSlotId || !timeSlotFormData.validFrom || !timeSlotFormData.validTo}
                    >
                        {isTsEditing ? "Update" : "Associate"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
