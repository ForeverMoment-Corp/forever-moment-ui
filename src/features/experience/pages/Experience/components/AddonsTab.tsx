import React, { useEffect, useMemo, useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { Package, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import { NumberInput } from '@/components/common/NumberInput';

/** One row of GET /admin/experiences/{experienceId}/addons (ExperienceAddonResponseDto). */
export interface ExperienceAddon {
    mapperId?: number;
    addonId: number;
    mediaId?: number;
    name?: string;
    addonName?: string; // legacy field name from the experience-detail payload
    description?: string;
    icon?: string;
    heroUrl?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    basePrice?: number;
    priceOverride?: number;
    effectivePrice?: number;
    isFree?: boolean;
    isActive?: boolean;
}

interface AddonsTabProps {
    experienceId: number;
    availableAddons: any[]; // All master addons in the system
    experienceAddons: ExperienceAddon[]; // From GET /admin/experiences/{experienceId}/addons
    loading?: boolean;
    getExperienceAddons?: (experienceId: number) => Promise<any>;
    onToggleAddon: (addonId: number, isAssociate: boolean, data?: any) => void;
}

const addonName = (ea: ExperienceAddon) => ea.name || ea.addonName || `Add-on #${ea.addonId}`;

const formatPrice = (value?: number | null) =>
    value == null ? '—' : `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** Price shown to customers: the API's effectivePrice, else override, else base. */
const displayPrice = (ea: ExperienceAddon) => {
    if (ea.isFree) return 'Free';
    return formatPrice(ea.effectivePrice ?? ea.priceOverride ?? ea.basePrice);
};

interface AddonFormData {
    priceOverride: number;
    isFree: boolean;
}

const emptyForm: AddonFormData = {
    priceOverride: 0,
    isFree: false
};

export const AddonsTab: React.FC<AddonsTabProps> = ({
    experienceId,
    availableAddons,
    experienceAddons,
    loading = false,
    getExperienceAddons,
    onToggleAddon
}) => {
    const [search, setSearch] = useState("");
    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [selectedAddonId, setSelectedAddonId] = useState<number | null>(null);
    const [formData, setFormData] = useState<AddonFormData>(emptyForm);

    // Load this experience's add-ons from the dedicated endpoint whenever the experience changes.
    useEffect(() => {
        if (experienceId && getExperienceAddons) {
            getExperienceAddons(experienceId).catch(() => { /* error surfaced via store */ });
        }
    }, [experienceId, getExperienceAddons]);

    const filteredAssignedAddons = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (experienceAddons || []).filter((ea) => !q || addonName(ea).toLowerCase().includes(q) || ea.description?.toLowerCase().includes(q));
    }, [experienceAddons, search]);

    const handleOpenAssocModal = () => {
        setSelectedAddonId(null);
        setFormData(emptyForm);
        setIsAssocModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssocModalOpen(false);
        setSelectedAddonId(null);
        setFormData(emptyForm);
    };

    const handleSubmit = () => {
        if (!selectedAddonId) return;

        const data = {
            priceOverride: Number(formData.priceOverride),
            isFree: formData.isFree
        };

        onToggleAddon(selectedAddonId, true, data);
        handleCloseModal();
    };

    // Filter available addons down to those that are active and not already assigned
    const unassignedAddons = (availableAddons || []).filter((addon: any) =>
        addon.isActive && !experienceAddons?.some((ea) => ea.addonId === addon.id)
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <SearchBar
                    className="flex-1"
                    inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    placeholder="Search add-ons..."
                    value={search}
                    onChange={setSearch}
                />
                <Button onClick={handleOpenAssocModal} className="h-10 px-3 text-sm shrink-0">
                    Associate Add-on
                </Button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 pb-20">
                {loading && filteredAssignedAddons.length === 0 && (
                    <div className="flex items-center justify-center gap-2 py-5 text-sm text-slate-400">
                        <Loader2 size={16} className="animate-spin" /> Loading add-ons…
                    </div>
                )}
                {filteredAssignedAddons.map((ea) => (
                    <div key={ea.mapperId ?? ea.addonId} className="flex flex-col gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-blue-300">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    {ea.thumbnailUrl || ea.originalUrl ? (
                                        <img src={getMediaAssetUrl(ea.thumbnailUrl || ea.originalUrl)} alt={addonName(ea)} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package size={18} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        {addonName(ea)}
                                        {ea.isActive === false && (
                                            <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-gray-800 text-slate-500 px-1.5 py-0.5 rounded-full">Inactive</span>
                                        )}
                                        {ea.isFree && (
                                            <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Free
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Price: <span className="font-semibold text-slate-700 dark:text-slate-200">{displayPrice(ea)}</span>
                                        {!ea.isFree && ea.priceOverride != null && ea.basePrice != null && Number(ea.priceOverride) !== Number(ea.basePrice) && (
                                            <span className="ml-1.5 text-slate-400">(base {formatPrice(ea.basePrice)})</span>
                                        )}
                                    </p>
                                    {ea.description && (
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ea.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onToggleAddon(ea.addonId, false)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove Association"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {!loading && filteredAssignedAddons.length === 0 && (
                    <div className="text-center py-6 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <Package className="mx-auto h-8 w-8 opacity-20 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No add-ons associated.</p>
                        <p className="text-xs mt-1">Click "Associate Add-on" to link one.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                title="Associate New Add-on"
                className="max-w-md w-[95vw]"
            >
                <div className="space-y-3">
                    <div>
                        <Dropdown
                            label="Select Add-on"
                            options={unassignedAddons.map((addon: any) => ({
                                id: addon.id.toString(),
                                value: addon.id.toString(),
                                label: `${addon.name} (Base Price: ₹${addon.basePrice})`
                            }))}
                            value={selectedAddonId ? selectedAddonId.toString() : ''}
                            onChange={(value: string) => setSelectedAddonId(Number(value))}
                            placeholder="-- Select an Add-on --"
                            className="w-full"
                        />
                        {unassignedAddons.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1.5">No matching active add-ons available to assign.</p>
                        )}
                    </div>

                    {!formData.isFree && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Price Override (₹)
                            </label>
                            <NumberInput
                                min="0"
                                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                                value={formData.priceOverride}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceOverride: Number(e.target.value) }))}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
                        <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">Is Free?</div>
                            <div className="text-xs text-slate-500">Mark this add-on as free for this experience</div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isFree}
                                onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked, priceOverride: e.target.checked ? 0 : prev.priceOverride }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative"></div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-gray-800 mt-3">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedAddonId}
                        >
                            Associate
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
