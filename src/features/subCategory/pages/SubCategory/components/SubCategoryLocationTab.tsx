import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface SubCategoryLocationTabProps {
    subCategory: any;
    allLocations: any[];
    /** Flat sub-category ↔ location junction rows (see getSubCategoryLocationLinks). */
    subCategoryLocationLinks: any[];
    loadingLinks?: boolean;
    onAssociate: (locationId: number, subCategoryId: number, data: any) => Promise<any>;
    onDisassociate: (locationId: number, subCategoryId: number) => Promise<any>;
    fetchLocations: () => void;
    /** Rebuilds the association index after a toggle. */
    fetchLinks: () => Promise<any>;
    onSuccess?: () => void;
}

export const SubCategoryLocationTab: React.FC<SubCategoryLocationTabProps> = ({
    subCategory,
    allLocations,
    subCategoryLocationLinks,
    loadingLinks,
    onAssociate,
    onDisassociate,
    fetchLocations,
    fetchLinks,
    onSuccess
}) => {
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    // The index covers every sub-category, so it is built once and reused as the user
    // moves between sub-categories rather than refetched per selection.
    useEffect(() => {
        Promise.resolve(fetchLinks()).catch(() => undefined); // the action surfaces the error
    }, [fetchLinks]);

    const assignedIds = useMemo(
        () => (subCategoryLocationLinks || [])
            .filter((link: any) => String(link.subCategoryId) === String(subCategory?.id))
            .map((link: any) => link.locationId)
            .filter((id: any) => id != null),
        [subCategoryLocationLinks, subCategory?.id]
    );

    const handleToggle = async (locationId: number, isAssigned: boolean) => {
        setIsToggling(true);
        try {
            if (isAssigned) {
                await onDisassociate(locationId, subCategory.id);
            } else {
                await onAssociate(locationId, subCategory.id, { displayOrder: 0, active: true });
            }
            // The write only touches one junction row, but the index is the source of
            // truth for the checkmarks, so it has to be rebuilt before they are correct.
            await fetchLinks();
            onSuccess?.();
        } catch {
            // error handling done in action
        } finally {
            setIsToggling(false);
        }
    };

    // Only block on the very first build; later rebuilds keep the list interactive.
    if (loadingLinks && (subCategoryLocationLinks || []).length === 0 && !isToggling) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="mt-3 text-[13px]">Loading assigned locations…</p>
            </div>
        );
    }

    return (
        <AssociationList
            items={allLocations}
            assignedIds={assignedIds}
            onToggle={handleToggle}
            icon={MapPin}
            entityName="locations"
            searchPlaceholder="Search locations..."
            emptyLabel="No locations found."
            renderLabel={(loc) => ({
                title: loc.name,
                subtitle: loc.city || 'No city specified',
            })}
            searchFilter={(loc, q) => {
                const query = q.toLowerCase();
                return (
                    loc.name?.toLowerCase().includes(query) ||
                    loc.city?.toLowerCase().includes(query)
                );
            }}
        />
    );
};
