import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { PromotionAssetPayload, PromotionAssetType } from '@/features/promotionAssets/store/action-types';
import {
    SCHEDULE_BADGE_VARIANT,
    SCHEDULE_LABEL,
    describeWindow,
    formatDateTime,
    getScheduleState,
    toApiDateTime,
    toInputDateTime,
    toPayload,
    validatePayload,
} from '@/features/promotionAssets/store/utils';
import { NumberInput } from '@/components/common/NumberInput';

interface PromotionAssetDetailsProps {
    asset: PromotionAssetType;
    updatePromotionAsset: (id: number, data: PromotionAssetPayload) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

type EditableKey = 'promoKey' | 'placement' | 'title' | 'altTextOverride' | 'priority' | 'startAt' | 'endAt';

export const PromotionAssetDetails = ({ asset, updatePromotionAsset, onDirtyChange }: PromotionAssetDetailsProps) => {
    const [editingField, setEditingField] = useState<EditableKey | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const fieldMapping = useMemo(() => ({
        promoKey: 'Promotion Key',
        placement: 'Placement',
        title: 'Title',
        altTextOverride: 'Alt Text Override',
        priority: 'Priority',
        startAt: 'Starts At',
        endAt: 'Ends At',
        isActive: 'Status',
    }), []);

    const { localData, updateField, isDirty, handleDiscard, changes } = useUnsavedChanges({
        originalData: asset,
        fieldMapping,
        onDirtyChange,
    });

    useEffect(() => {
        if (editingField && inputRef.current) inputRef.current.focus();
    }, [editingField]);

    const liveState = getScheduleState(localData);

    const handleFinalSave = async () => {
        const payload = toPayload(asset, {
            promoKey: (localData.promoKey || '').trim(),
            placement: (localData.placement || '').trim(),
            title: localData.title?.trim() || null,
            altTextOverride: localData.altTextOverride?.trim() || null,
            priority: Number(localData.priority ?? 100),
            isActive: localData.isActive,
            startAt: toApiDateTime(localData.startAt),
            endAt: toApiDateTime(localData.endAt),
        });
        const validation = validatePayload(payload);
        const firstError = Object.values(validation)[0];
        if (firstError) {
            setSaveError(firstError);
            return;
        }
        setSaveError(null);
        setIsSaving(true);
        try {
            await updatePromotionAsset(asset.id, payload);
        } catch (error) {
            console.error('Failed to save promotion asset changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) setEditingField(null);
        if (e.key === 'Escape') setEditingField(null);
    };

    const EditIcon = () => (
        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
    );

    const inputClass = 'w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all';

    const renderField = (
        label: string,
        key: EditableKey,
        opts: { type?: 'text' | 'number' | 'datetime-local' | 'textarea'; display?: string; mono?: boolean; placeholder?: string } = {}
    ) => {
        const { type = 'text', display, mono, placeholder } = opts;
        const isEditing = editingField === key;
        const rawValue = (localData as any)[key];
        const displayValue = display !== undefined ? display : rawValue;

        let inputValue: string | number = rawValue ?? '';
        if (type === 'datetime-local') inputValue = toInputDateTime(rawValue);

        return (
            <div className={cn('group relative', type === 'textarea' && 'col-span-2')}>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    type === 'textarea' ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            value={inputValue as string}
                            onChange={(e) => updateField(key, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                            className={cn(inputClass, 'min-h-[72px] resize-none leading-relaxed')}
                        />
                    ) : type === 'number' ? (
                        <NumberInput
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            step={1}
                            value={inputValue}
                            onChange={(e) => updateField(key, e.target.value === '' ? 0 : Number(e.target.value))}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                            className={cn(inputClass, mono && 'font-mono')}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type={type}
                            value={inputValue}
                            onChange={(e) => {
                                if (type === 'datetime-local') updateField(key, e.target.value ? toApiDateTime(e.target.value) : null);
                                else updateField(key, e.target.value);
                            }}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={handleKeyDown}
                            className={cn(inputClass, mono && 'font-mono')}
                        />
                    )
                ) : (
                    <div
                        className={cn(
                            'text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2',
                            type === 'textarea' ? 'items-start whitespace-pre-line leading-relaxed' : 'items-center'
                        )}
                        onClick={() => setEditingField(key)}
                    >
                        <span className={cn(mono && 'font-mono', (displayValue === '' || displayValue == null) && 'text-slate-400 italic font-normal text-[12px]')}>
                            {displayValue === '' || displayValue == null ? (placeholder || 'Empty') : String(displayValue)}
                        </span>
                        <EditIcon />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {/* ── TARGETING ───────────────────────────── */}
            <SectionLabel>Targeting</SectionLabel>
            <FieldGrid>
                <Cell>{renderField('Promotion Key', 'promoKey', { mono: true })}</Cell>
                <Cell>{renderField('Placement', 'placement')}</Cell>
                <Cell>{renderField('Title', 'title', { placeholder: 'No title' })}</Cell>
                <Cell>{renderField('Priority', 'priority', { type: 'number' })}</Cell>
            </FieldGrid>

            {/* ── SCHEDULE ─────────────────────────────── */}
            <SectionLabel>Schedule</SectionLabel>
            <FieldGrid>
                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="mt-1 flex items-center gap-3">
                        <EditableStatusBadge
                            status={localData.isActive ? 'true' : 'false'}
                            options={[
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' },
                            ]}
                            onChange={(val) => updateField('isActive', val === 'true')}
                        />
                        <StatusBadge status={SCHEDULE_LABEL[liveState]} variant={SCHEDULE_BADGE_VARIANT[liveState]} />
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Window</FieldLabel>
                    <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 mt-1">{describeWindow(localData)}</div>
                </Cell>
                <Cell>{renderField('Starts At', 'startAt', { type: 'datetime-local', display: formatDateTime(localData.startAt, ''), placeholder: 'Immediately' })}</Cell>
                <Cell>{renderField('Ends At', 'endAt', { type: 'datetime-local', display: formatDateTime(localData.endAt, ''), placeholder: 'Never' })}</Cell>
            </FieldGrid>

            {/* ── ACCESSIBILITY ────────────────────────── */}
            <SectionLabel>Accessibility</SectionLabel>
            <div className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3">
                {renderField('Alt text override', 'altTextOverride', { type: 'textarea', placeholder: 'Uses the media record\'s alt text' })}
            </div>

            {saveError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-3">{saveError}</p>
            )}

            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleFinalSave}
                onDiscard={() => { setSaveError(null); handleDiscard(); }}
                changes={changes}
            />
        </div>
    );
};
