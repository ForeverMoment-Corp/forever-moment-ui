import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface SubCategoryLocationTabProps {
    subCategory: any;
    allLocations: any[];
    onAssociate: (locationId: number, subCategoryId: number, data: any) => void;
    onDisassociate: (locationId: number, subCategoryId: number) => void;
    fetchLocations: () => void;
}

export const SubCategoryLocationTab: React.FC<SubCategoryLocationTabProps> = ({
    subCategory,
    allLocations,
    onAssociate,
    onDisassociate,
    fetchLocations
}) => {
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    const assignedIds = subCategory?.locations?.map((l: any) => l.id) || [];

    const handleToggle = (locationId: number, isAssigned: boolean) => {
        if (isAssigned) {
            onDisassociate(locationId, subCategory.id);
        } else {
            onAssociate(locationId, subCategory.id, { displayOrder: 0, active: true });
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
