import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface CategoryLocationTabProps {
    category: any;
    allLocations: any[];
    onAssociate: (locationId: number, categoryId: number, data: any) => void;
    onDisassociate: (locationId: number, categoryId: number) => void;
    fetchLocations: () => void;
}

export const CategoryLocationTab: React.FC<CategoryLocationTabProps> = ({
    category,
    allLocations,
    onAssociate,
    onDisassociate,
    fetchLocations
}) => {
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    const assignedIds = category?.locations?.map((l: any) => l.id) || [];

    const handleToggle = (locationId: number, isAssigned: boolean) => {
        if (isAssigned) {
            onDisassociate(locationId, category.id);
        } else {
            onAssociate(locationId, category.id, { displayOrder: 0, active: true });
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
