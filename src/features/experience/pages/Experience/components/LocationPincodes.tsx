import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Hash, X } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { cn } from '@/utils/cn';
import {
    getExperienceLocationPincodes,
    replaceExperienceLocationPincodes,
    removeExperienceLocationPincode,
} from '@/features/experience/store/actions';
// Read straight from the API rather than the location store's pincode thunk, which would
// overwrite the Locations page's own pincode list.
import { fetchPincodeData } from '@/features/location/store/api';

interface LocationPincodesProps {
    mapperId: number;
    locationId: number;
}

const errorMessage = (error: any, fallback: string) => error?.response?.data?.message || fallback;

/**
 * Pincode whitelist for one experience-location mapping. No pincodes selected means the
 * experience is serviceable at every pincode of the location.
 */
export const LocationPincodes: React.FC<LocationPincodesProps> = ({ mapperId, locationId }) => {
    const dispatch = useDispatch<any>();
    const [restricted, setRestricted] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isManaging, setIsManaging] = useState(false);
    const [locationPincodes, setLocationPincodes] = useState<any[]>([]);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        dispatch(getExperienceLocationPincodes(mapperId))
            .then((pincodes: any[]) => { if (!cancelled) setRestricted(pincodes); })
            .catch((error: any) => toast.error(errorMessage(error, 'Failed to load pincode restrictions')))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [dispatch, mapperId]);

    const openManager = useCallback(async () => {
        setSelectedIds(new Set(restricted.map((p) => p.id)));
        setSearch('');
        setIsManaging(true);
        setOptionsLoading(true);
        try {
            const response = await fetchPincodeData(locationId);
            const rows = response.data?.response || [];
            setLocationPincodes(Array.isArray(rows) ? rows : []);
        } catch (error: any) {
            toast.error(errorMessage(error, 'Failed to load location pincodes'));
        } finally {
            setOptionsLoading(false);
        }
    }, [locationId, restricted]);

    const filteredOptions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return locationPincodes;
        return locationPincodes.filter((p) =>
            [p.pincodeCode, p.areaName, p.name].some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
        );
    }, [locationPincodes, search]);

    const toggleSelected = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const pincodes = await dispatch(replaceExperienceLocationPincodes(mapperId, Array.from(selectedIds)));
            setRestricted(pincodes);
            setIsManaging(false);
            toast.success(pincodes.length ? 'Pincode restrictions updated' : 'Restrictions cleared — all pincodes allowed');
        } catch (error: any) {
            toast.error(errorMessage(error, 'Failed to update pincode restrictions'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async (pincodeId: number) => {
        setRemovingId(pincodeId);
        try {
            await dispatch(removeExperienceLocationPincode(mapperId, pincodeId));
            setRestricted((prev) => prev.filter((p) => p.id !== pincodeId));
        } catch (error: any) {
            toast.error(errorMessage(error, 'Failed to remove pincode'));
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1">
                    <Hash size={12} /> Serviceable Pincodes
                    {!loading && (
                        <span className={cn(
                            'ml-1 normal-case tracking-normal font-semibold px-1.5 py-0.5 rounded-full text-[10px]',
                            restricted.length
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        )}>
                            {restricted.length ? `${restricted.length} restricted` : 'All pincodes'}
                        </span>
                    )}
                </span>
                {!isManaging && (
                    <button
                        type="button"
                        onClick={openManager}
                        disabled={loading}
                        className="p-1 px-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded border border-blue-100 dark:border-blue-800 transition-colors disabled:opacity-50"
                    >
                        Manage
                    </button>
                )}
            </div>

            {loading ? (
                <div className="h-6 w-40 bg-slate-100 dark:bg-gray-800 animate-pulse rounded" />
            ) : isManaging ? (
                <div className="rounded-lg border border-slate-200 dark:border-gray-700 p-2 space-y-2">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search pincode or area…" />
                    <div className="max-h-48 overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5">
                        {optionsLoading ? (
                            <p className="text-xs text-slate-400 py-2">Loading pincodes…</p>
                        ) : filteredOptions.length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">
                                {locationPincodes.length ? 'No pincodes match your search.' : 'This location has no pincodes yet.'}
                            </p>
                        ) : filteredOptions.map((p) => (
                            <label key={p.id} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer text-xs">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(p.id)}
                                    onChange={() => toggleSelected(p.id)}
                                    className="h-3.5 w-3.5 accent-[var(--accent)]"
                                />
                                <span className="font-semibold text-slate-800 dark:text-slate-100">{p.pincodeCode}</span>
                                <span className="text-slate-500 truncate">{p.areaName || p.name}</span>
                                {p.isActive === false && <span className="text-[10px] text-slate-400 italic">inactive</span>}
                            </label>
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-gray-800">
                        <span className="text-[11px] text-slate-500">
                            {selectedIds.size ? `${selectedIds.size} selected` : 'None selected — all pincodes allowed'}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {selectedIds.size > 0 && (
                                <button type="button" onClick={() => setSelectedIds(new Set())} disabled={isSaving} className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                                    Clear
                                </button>
                            )}
                            <button type="button" onClick={() => setIsManaging(false)} disabled={isSaving} className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-gray-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSave} disabled={isSaving || optionsLoading} className="px-2.5 py-1 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[11px] font-semibold disabled:opacity-50">
                                {isSaving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : restricted.length === 0 ? (
                <p className="text-xs text-slate-500">Available at every pincode of this location.</p>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {restricted.map((p) => (
                        <span key={p.id} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-[11px] text-slate-700 dark:text-slate-200">
                            <span className="font-semibold">{p.pincodeCode}</span>
                            {p.areaName && <span className="text-slate-500">· {p.areaName}</span>}
                            <button
                                type="button"
                                onClick={() => handleRemove(p.id)}
                                disabled={removingId === p.id}
                                title="Remove pincode"
                                className="p-0.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40"
                            >
                                <X size={11} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
