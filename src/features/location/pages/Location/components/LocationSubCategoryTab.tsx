import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface LocationSubCategoryTabProps {
    location: any;
    allSubCategories: any[];
    onAssociate: (locationId: number, subCategoryId: number, data: any) => Promise<any>;
    onDisassociate: (locationId: number, subCategoryId: number) => Promise<any>;
    onSuccess?: () => void;
}

export const LocationSubCategoryTab: React.FC<LocationSubCategoryTabProps> = ({
    location,
    allSubCategories,
    onAssociate,
    onDisassociate,
    onSuccess
}) => {
    const assignedIds = location?.subCategories?.map((sc: any) => sc.subCategoryId) || [];

    const handleToggle = async (subCategoryId: number, isAssigned: boolean) => {
        try {
            if (isAssigned) {
                await onDisassociate(location.id, subCategoryId);
            } else {
                await onAssociate(location.id, subCategoryId, { displayOrder: 0, active: true });
            }
            onSuccess?.();
        } catch (e) {
            // error handling is done in the action
        }
    };

    return (
        <AssociationList
            items={allSubCategories}
            assignedIds={assignedIds}
            onToggle={handleToggle}
            icon={LayoutGrid}
            entityName="sub categories"
            searchPlaceholder="Search sub categories..."
            emptyLabel="No sub categories found."
            renderLabel={(sc) => ({
                title: sc.name,
                subtitle: sc.description || 'No description',
            })}
        />
    );
};
