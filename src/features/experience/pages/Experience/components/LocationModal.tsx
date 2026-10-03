import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { Button } from '@/components/common/Button';
import { NumberInput } from '@/components/common/NumberInput';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    unassignedLocations: any[];
    selectedLocationId: number | null;
    setSelectedLocationId: (id: number) => void;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
    isOpen,
    onClose,
    isEditing,
    unassignedLocations,
    selectedLocationId,
    setSelectedLocationId,
    formData,
    setFormData,
    onSubmit
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Update Location Details' : 'Associate New Location'}
            className="max-w-md w-[95vw]"
        >
            <div className="space-y-3">
                {!isEditing && (
                    <div>
                        <Dropdown
                            label="Select Location"
                            options={unassignedLocations.map((loc: any) => ({
                                id: loc.id.toString(),
                                value: loc.id.toString(),
                                label: `${loc.name} ${loc.city ? `(${loc.city})` : ''}`
                            }))}
                            value={selectedLocationId ? selectedLocationId.toString() : ''}
                            onChange={(value: string) => setSelectedLocationId(Number(value))}
                            placeholder="-- Select a Location --"
                            className="w-full"
                        />
                        {unassignedLocations.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1.5">No matching active locations available to assign.</p>
                        )}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Price Override (₹)
                    </label>
                    <NumberInput
                        min="0"
                        className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                        value={formData.priceOverride}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, priceOverride: Number(e.target.value) }))}
                    />
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
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, validFrom: e.target.value }))}
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
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, validTo: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Active Status</div>
                        <div className="text-xs text-slate-500">Enable or disable this specific price/location rule</div>
                    </div>
                    <label className="flex items-center cursor-pointer relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.isActive}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-gray-800 mt-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!selectedLocationId || !formData.validFrom || !formData.validTo}
                    >
                        {isEditing ? 'Save Changes' : 'Associate'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
