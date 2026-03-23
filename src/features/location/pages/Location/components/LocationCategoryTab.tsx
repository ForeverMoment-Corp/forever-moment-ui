import React from 'react';
import { Component } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface LocationCategoryTabProps {
    location: any;
    allCategories: any[];
    onAssociate: (locationId: number, categoryId: number, data: any) => Promise<any>;
    onDisassociate: (locationId: number, categoryId: number) => Promise<any>;
    onSuccess?: () => void;
}

export const LocationCategoryTab: React.FC<LocationCategoryTabProps> = ({
    location,
    allCategories,
    onAssociate,
    onDisassociate,
    onSuccess
}) => {
    const assignedIds = location?.categories?.map((c: any) => c.categoryId) || [];

    const handleToggle = async (categoryId: number, isAssigned: boolean) => {
        try {
            if (isAssigned) {
                await onDisassociate(location.id, categoryId);
            } else {
                await onAssociate(location.id, categoryId, { displayOrder: 0, active: true });
            }
            onSuccess?.();
        } catch (e) {
            // error handling is done in the action
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
