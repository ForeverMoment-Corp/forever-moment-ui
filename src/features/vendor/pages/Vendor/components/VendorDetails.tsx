import { useState, useRef, useEffect, useMemo } from 'react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { TabFooter } from '@/components/common/TabFooter';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { cn } from '@/utils/cn';
import type { Vendor } from './Vendor';

interface VendorDetailsProps {
    vendor: Vendor;
    onEdit: () => void;
    onClose: () => void;
    updateVendor: (id: number, payload: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

export const VendorDetails = ({ vendor, onEdit, updateVendor, onDirtyChange }: VendorDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const consolidatedData = useMemo(() => ({
        name: vendor.name || '',
        category: vendor.category || '',
        status: vendor.status || 'Active',
        contactPerson: vendor.contactPerson || '',
        email: vendor.email || '',
        phone: vendor.phone || ''
    }), [vendor]);

    const fieldMapping = useMemo(() => ({
        name: 'Business Name',
        category: 'Category',
        status: 'Status',
        contactPerson: 'Contact Person',
        email: 'Email',
        phone: 'Phone'
    }), []);

    const {
        localData,
        updateField,
        isDirty,
        handleDiscard,
        changes
    } = useUnsavedChanges({
        originalData: consolidatedData,
        fieldMapping,
        onDirtyChange
    });

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(String(value || ''));
    };

    const handleFieldUpdate = (field: string, value: any) => {
        setEditValue(value);
        updateField(field, value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateVendor(vendor.id, localData);
        } catch (e) {
            console.error("Failed to update vendor", e);
        } finally {
            setIsSaving(false);
        }
    };

    const renderCellField = (label: string, field: string, value: string) => {
        const isEditing = editingField === field;

        return (
            <div className="group relative">
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={editValue}
                        onChange={(e) => handleFieldUpdate(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <div
                        className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2 items-center"
                        onClick={() => handleEditStart(field, value)}
                    >
                        <span className={cn(!value && "text-slate-400 italic font-normal text-[12px]")}>{value || 'Empty'}</span>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 pb-20">
            <SectionLabel>General Information</SectionLabel>
            <FieldGrid>
                <Cell>
                    {renderCellField('Business Name', 'name', localData.name)}
                </Cell>

                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={localData.status}
                            options={[
                                { label: 'Active', value: 'Active' },
                                { label: 'Inactive', value: 'Inactive' },
                                { label: 'Pending', value: 'Pending' }
                            ]}
                            onChange={(val) => updateField('status', val)}
                        />
                    </div>
                </Cell>

                <Cell>
                    {renderCellField('Category', 'category', localData.category)}
                </Cell>

                <Cell />
            </FieldGrid>

            <SectionLabel>Contact Information</SectionLabel>
            <FieldGrid>
                <Cell>
                    {renderCellField('Contact Person', 'contactPerson', localData.contactPerson)}
                </Cell>

                <Cell>
                    {renderCellField('Phone', 'phone', localData.phone)}
                </Cell>

                <Cell full>
                    {renderCellField('Email', 'email', localData.email)}
                </Cell>
            </FieldGrid>

            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleSave}
                onDiscard={handleDiscard}
                changes={changes}
            />
        </div>
    );
};
