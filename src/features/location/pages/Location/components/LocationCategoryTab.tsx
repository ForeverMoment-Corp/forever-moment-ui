import React from 'react';
import { Component } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface LocationCategoryTabProps {
    location: any;
    allCategories: any[];
    onAssociate: (locationId: number, categoryId: number, data: any) => void;
    onDisassociate: (locationId: number, categoryId: number) => void;
}

export const LocationCategoryTab: React.FC<LocationCategoryTabProps> = ({
    location,
    allCategories,
    onAssociate,
    onDisassociate
}) => {
    const assignedIds = location?.categories?.map((c: any) => c.categoryId) || [];

    const handleToggle = (categoryId: number, isAssigned: boolean) => {
        if (isAssigned) {
            onDisassociate(location.id, categoryId);
        } else {
            onAssociate(location.id, categoryId, { displayOrder: 0, active: true });
        }
    };

    return (
        <AssociationList
            items={allCategories}
            assignedIds={assignedIds}
            onToggle={handleToggle}
            icon={Component}
            entityName="categories"
            searchPlaceholder="Search categories..."
            emptyLabel="No categories found."
            renderLabel={(cat) => ({
                title: cat.name,
                subtitle: cat.description || 'No description',
            })}
        />
    );
};
