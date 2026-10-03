import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface CategoryLocationTabProps {
    category: any;
    allLocations: any[];
    /** Flat category ↔ location junction rows for every category (see getCategoryLocationLinks). */
    categoryLocationLinks: any[];
    loadingLinks?: boolean;
    onAssociate: (locationId: number, categoryId: number, data: any) => Promise<any>;
    onDisassociate: (locationId: number, categoryId: number) => Promise<any>;
    fetchLocations: () => void;
    /** Rebuilds the association index after a toggle. */
    fetchLinks: () => Promise<any>;
    onSuccess?: () => void;
}

export const CategoryLocationTab: React.FC<CategoryLocationTabProps> = ({
    category,
    allLocations,
    categoryLocationLinks,
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

    // The index covers every category, so it is built once and reused as the user
    // moves between categories rather than refetched per selection.
    useEffect(() => {
        Promise.resolve(fetchLinks()).catch(() => undefined); // the action surfaces the error
    }, [fetchLinks]);

    const assignedIds = useMemo(
        () => (categoryLocationLinks || [])
            .filter((link: any) => String(link.categoryId) === String(category?.id))
            .map((link: any) => link.locationId)
            .filter((id: any) => id != null),
        [categoryLocationLinks, category?.id]
    );

    const handleToggle = async (locationId: number, isAssigned: boolean) => {
        setIsToggling(true);
        try {
            if (isAssigned) {
                await onDisassociate(locationId, category.id);
            } else {
                await onAssociate(locationId, category.id, { displayOrder: 0, active: true });
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
    if (loadingLinks && (categoryLocationLinks || []).length === 0 && !isToggling) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
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
