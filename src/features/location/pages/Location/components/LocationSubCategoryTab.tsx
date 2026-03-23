import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { AssociationList } from '@/components/common/AssociationList';

interface LocationSubCategoryTabProps {
    location: any;
    allSubCategories: any[];
    onAssociate: (locationId: number, subCategoryId: number, data: any) => void;
    onDisassociate: (locationId: number, subCategoryId: number) => void;
}

export const LocationSubCategoryTab: React.FC<LocationSubCategoryTabProps> = ({
    location,
    allSubCategories,
    onAssociate,
    onDisassociate
}) => {
    const assignedIds = location?.subCategories?.map((sc: any) => sc.subCategoryId) || [];

    const handleToggle = (subCategoryId: number, isAssigned: boolean) => {
        if (isAssigned) {
            onDisassociate(location.id, subCategoryId);
        } else {
            onAssociate(location.id, subCategoryId, { displayOrder: 0, active: true });
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
