import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Dropdown } from '@/components/common/Dropdown';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { NumberInput } from '@/components/common/NumberInput';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

interface PromotionDetailsProps {
    promotion: any;
    updatePromotion: (id: number | string, data: any) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

const DISCOUNT_TYPES = [
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED_AMOUNT', label: 'Flat Amount' },
];

const INPUT_CLASS = 'w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all';

const toDateInput = (value?: string) => (value ? value.split('T')[0] : '');

const formatDate = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const PencilIcon = () => (
    <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
);

export const PromotionDetails = ({ promotion, updatePromotion, onDirtyChange }: PromotionDetailsProps) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string | number>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Same shape the create/edit modal submits, so inline saves hit the API identically.
    const consolidatedData = useMemo(() => ({
        code: promotion.code || '',
        name: promotion.name || '',
        description: promotion.description || '',
        discountType: promotion.discountType || 'PERCENTAGE',
        discountValue: promotion.discountValue || 0,
        maxDiscountAmount: promotion.maxDiscountAmount || 0,
        minBookingAmount: promotion.minBookingAmount || 0,
        validFrom: toDateInput(promotion.validFrom),
        validTo: toDateInput(promotion.validTo),
        usageLimit: promotion.usageLimit || 0,
        isActive: promotion.isActive ?? true,
    }), [promotion]);

    const fieldMapping = useMemo(() => ({
        code: 'Coupon Code',
        name: 'Name',
        description: 'Description',
        discountType: 'Discount Type',
        discountValue: 'Discount Value',
        maxDiscountAmount: 'Max Discount',
        minBookingAmount: 'Min Booking Amount',
        validFrom: 'Valid From',
        validTo: 'Valid To',
        usageLimit: 'Usage Limit',
        isActive: 'Status',
    }), []);

    const { localData, updateField, isDirty, handleDiscard, changes } = useUnsavedChanges({
        originalData: consolidatedData,
        fieldMapping,
        onDirtyChange,
    });

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditStart = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(value ?? '');
    };

    const handleFieldUpdate = (field: string, value: any) => {
        setEditValue(value);
        updateField(field as any, value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePromotion(promotion.id, localData);
        } catch (e) {
            console.error('Failed to update promotion', e);
        } finally {
            setIsSaving(false);
        }
    };

    const isPercentage = localData.discountType === 'PERCENTAGE';
    const money = (v: number) => (v ? `₹${Number(v).toLocaleString()}` : '');

    const renderCellField = (
        label: string,
        fieldKey: keyof typeof consolidatedData,
        type: 'text' | 'number' | 'date',
        displayOverride?: string,
    ) => {
        const value = localData[fieldKey] as any;
        const displayValue = displayOverride !== undefined ? displayOverride : value;

        return (
            <div className="group relative">
                <FieldLabel>{label}</FieldLabel>
                {editingField === fieldKey ? (
                    type === 'number' ? (
                        <NumberInput
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            min="0"
                            value={editValue as number}
                            onChange={(e) => handleFieldUpdate(fieldKey, Number(e.target.value))}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                            className={INPUT_CLASS}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type={type}
                            value={editValue as string}
                            onChange={(e) => handleFieldUpdate(fieldKey, fieldKey === 'code' ? e.target.value.toUpperCase() : e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                            className={INPUT_CLASS}
                        />
                    )
                ) : (
                    <div
                        className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => handleEditStart(fieldKey, value)}
                    >
                        <span className={cn(fieldKey === 'code' && 'font-mono tracking-wide', !displayValue && 'text-slate-400 italic font-normal text-[12px]')}>
                            {displayValue || 'Empty'}
                        </span>
                        <PencilIcon />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {/* ── GENERAL ─────────────────────────────── */}
            <SectionLabel>General</SectionLabel>
            <FieldGrid>
                <Cell>{renderCellField('Coupon Code', 'code', 'text')}</Cell>
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center">
                        <EditableStatusBadge
                            status={localData.isActive ? 'true' : 'false'}
                            options={[
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' },
                            ]}
                            onChange={(val) => updateField('isActive', val === 'true')}
                        />
                    </div>
                </Cell>
                <Cell full>{renderCellField('Name', 'name', 'text')}</Cell>
            </FieldGrid>

            {/* ── DISCOUNT ────────────────────────────── */}
            <SectionLabel>Discount</SectionLabel>
            <FieldGrid>
                <Cell>
                    <div className="group relative">
                        <FieldLabel>Discount Type</FieldLabel>
                        {editingField === 'discountType' ? (
                            <Dropdown
                                label=""
                                options={DISCOUNT_TYPES}
                                value={localData.discountType}
                                onChange={(val) => {
                                    setEditingField(null);
                                    updateField('discountType', val || 'PERCENTAGE');
                                }}
                                searchable={false}
                            />
                        ) : (
                            <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2" onClick={() => setEditingField('discountType')}>
                                <span>{DISCOUNT_TYPES.find((t) => t.value === localData.discountType)?.label || localData.discountType}</span>
                                <PencilIcon />
                            </div>
                        )}
                    </div>
                </Cell>
                <Cell>
                    {renderCellField(
                        'Discount Value',
                        'discountValue',
                        'number',
                        localData.discountValue ? (isPercentage ? `${localData.discountValue}%` : money(localData.discountValue)) : '',
                    )}
                </Cell>
                <Cell>{renderCellField('Max Discount', 'maxDiscountAmount', 'number', money(localData.maxDiscountAmount))}</Cell>
                <Cell>{renderCellField('Min Booking Amount', 'minBookingAmount', 'number', money(localData.minBookingAmount))}</Cell>
            </FieldGrid>

            {/* ── VALIDITY & USAGE ────────────────────── */}
            <SectionLabel>Validity &amp; Usage</SectionLabel>
            <FieldGrid>
                <Cell>{renderCellField('Valid From', 'validFrom', 'date', formatDate(localData.validFrom))}</Cell>
                <Cell>{renderCellField('Valid To', 'validTo', 'date', formatDate(localData.validTo))}</Cell>
                <Cell full>
                    {renderCellField('Usage Limit', 'usageLimit', 'number', localData.usageLimit ? `${localData.usageLimit} uses` : 'Unlimited')}
                </Cell>
            </FieldGrid>

            {/* ── DESCRIPTION ─────────────────────────── */}
            <SectionLabel>Description</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-3 py-3">
                <FieldLabel>Description</FieldLabel>
                {editingField === 'description' ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                        value={editValue as string}
                        onChange={(e) => handleFieldUpdate('description', e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingField(null)}
                    />
                ) : (
                    <div className="flex items-start gap-2 cursor-pointer" onClick={() => handleEditStart('description', localData.description)}>
                        <p className={cn('text-[13px] leading-relaxed flex-1', localData.description ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic')}>
                            {localData.description || 'Empty'}
                        </p>
                        <PencilIcon />
                    </div>
                )}
            </div>

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
