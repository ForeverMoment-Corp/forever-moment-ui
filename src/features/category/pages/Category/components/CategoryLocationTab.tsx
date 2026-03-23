import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface CategoryLocationTabProps {
    category: any;
    allLocations: any[];
    onAssociate: (locationId: number, categoryId: number, data: any) => Promise<any>;
    onDisassociate: (locationId: number, categoryId: number) => Promise<any>;
    fetchLocations: () => void;
    onSuccess?: () => void;
}

export const CategoryLocationTab: React.FC<CategoryLocationTabProps> = ({
    category,
    allLocations,
    onAssociate,
    onDisassociate,
    fetchLocations,
    onSuccess
}) => {
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    const assignedIds = category?.locations?.map((l: any) => l.id) || [];

    const handleToggle = async (locationId: number, isAssigned: boolean) => {
        try {
            if (isAssigned) {
                await onDisassociate(locationId, category.id);
            } else {
                await onAssociate(locationId, category.id, { displayOrder: 0, active: true });
            }
            onSuccess?.();
        } catch (e) {
            // error handling done in action
        }
    };

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
