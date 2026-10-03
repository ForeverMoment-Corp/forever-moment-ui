import { useState, useRef, useEffect, useMemo } from 'react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { EditableFeatureBadge } from '@/components/common/EditableFeatureBadge';
import { InclusionsTab } from './InclusionsTab';
import { CancellationPolicyTab } from './CancellationPolicyTab';
import { LocationTab } from './LocationTab';
import { AddonsTab } from './AddonsTab';
import { ExperienceImages } from './ExperienceImages';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { RichTextContent } from '@/components/common/RichTextContent';
import { isHtmlEmpty, htmlToPlainText } from '@/utils/html';
import { Dropdown } from '@/components/common/Dropdown';
import { cn } from '@/utils/cn';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { TABS } from '@/config/constants';
import type { ExperienceType } from './Experience';
import type { SidePanelTab } from '@/components/common/SidePanelTabs';


interface ExperienceDetailsProps {
    experience: ExperienceType;
    experienceDetail: any;
    inclusions: any[];
    cancellationPolicies: any[];
    subCategories: any[];
    locations: any[];
    addons: any[];
    onToggleCancellationPolicy: (id: number, checked: boolean) => void;
    onToggleInclusion: (id: number, checked: boolean) => void;
    onAssociateLocation: (locationId: number, data: any) => void;
    onUpdateLocation: (locationId: number, data: any) => void;
    onDisassociateLocation: (locationId: number) => void;
    onToggleExperienceLocation: (locationId: number, mapperId: number) => void;
    onAssociateLocationTimeSlot: (locationId: number, timeSlotId: number, data: any) => void;
    onUpdateLocationTimeSlot: (locationId: number, timeSlotId: number, data: any) => void;
    onDisassociateLocationTimeSlot: (locationId: number, timeSlotId: number) => void;
    onBulkAttachLocationTimeSlots: (locationId: number, data: any) => void;
    onToggleLocationTimeSlot: (locationId: number, mapperId: number) => void;
    onToggleAddon: (addonId: number, isAssociate: boolean, data?: any) => void;
    experienceAddons: any[];
    addonsLoading?: boolean;
    getExperienceAddons: (experienceId: number) => Promise<any>;
    updateExperience: (id: number, data: any) => Promise<any>;
    slots: any[];
    images: any[];
    getImages: () => void;
    experienceMedia: any[];
    getExperienceMedia: (experienceId: number) => Promise<any>;
    bulkAttachMedia: (experienceId: number, data: { items: any[] }) => Promise<any>;
    disassociateMedia: (experienceId: number, mediaId: number) => Promise<any>;
    setPrimaryMedia: (experienceId: number, mediaId: number, current?: any) => Promise<any>;
    updateMediaAttachment: (experienceId: number, mediaId: number, data: any) => Promise<any>;
    toggleMediaActive: (experienceId: number, mapperId: number) => Promise<any>;
    uploadExperienceMedia?: (experienceId: number, file: File, attach?: any, metadata?: Record<string, any>, refresh?: boolean) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

const GeneralInfoTab = ({ experience, experienceDetail, updateExperience, subCategories, onDirtyChange }: any) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const consolidatedData = useMemo(() => ({
        name: experienceDetail?.name || experience.name || '',
        slug: experienceDetail?.slug || experience.slug || '',
        tagName: experienceDetail?.tagName || experience.tagName || '',
        basePrice: experienceDetail?.basePrice || experience.basePrice || 0,
        displayOrder: experienceDetail?.displayOrder || 0,
        isFeatured: experienceDetail?.isFeatured || false,
        isActive: experienceDetail?.isActive ?? experience.isActive ?? true,
        subCategoryId: experienceDetail?.subCategoryId || 0,
        shortDescription: experienceDetail?.detail?.shortDescription || '',
        description: experienceDetail?.detail?.description || '',
        durationMinutes: experienceDetail?.detail?.durationMinutes || 0,
        maxCapacity: experienceDetail?.detail?.maxCapacity || 0,
        minAge: experienceDetail?.detail?.minAge || 0,
        completionTime: experienceDetail?.detail?.completionTime || 0,
        minHours: experienceDetail?.detail?.minHours || 0,
        termsConditions: experienceDetail?.detail?.termsConditions || '',
        whatToBring: experienceDetail?.detail?.whatToBring || '',
    }), [experience, experienceDetail]);

    const fieldMapping = useMemo(() => ({
        name: 'Name',
        basePrice: 'Price',
        isActive: 'Status',
        isFeatured: 'Featured',
        subCategoryId: 'Sub Category',
        slug: 'Slug',
        tagName: 'Tag Name',
        durationMinutes: 'Duration',
        maxCapacity: 'Max Capacity',
        minAge: 'Min Age',
        completionTime: 'Completion Time',
        minHours: 'Min Hours',
        shortDescription: 'Short Description',
        description: 'Description',
        whatToBring: 'What To Bring',
        termsConditions: 'Terms & Conditions',
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

    // The unsaved-changes diff renders values as text, so show the description's
    // prose rather than its markup.
    const displayChanges = useMemo(
        () => changes.map((change: any) => (
            change.field === fieldMapping.description
                ? { ...change, original: htmlToPlainText(change.original), current: htmlToPlainText(change.current) }
                : change
        )),
        [changes, fieldMapping.description]
    );

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleEditClick = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(value ? String(value) : '');
    };

    const handleFieldUpdate = (field: any, value: any) => {
        const valueToSave = field === 'basePrice' || field === 'durationMinutes' || field === 'maxCapacity' || field === 'minAge' || field === 'completionTime' || field === 'minHours'
            ? Number(value)
            : value;
        setEditValue(String(value));
        updateField(field, valueToSave);
    };

    const handleFinalSave = async () => {
        setIsSaving(true);
        try {
            await updateExperience(experience.id, localData);
        } catch (e) {
            console.error("Failed to save experience changes", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingField(null);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };




    const renderCellField = (label: string, field: keyof typeof localData, value: any, isTextArea = false, displayOverride?: string) => {
        const isEditing = editingField === field;
        const displayValue = displayOverride !== undefined ? displayOverride : value;
        return (
            <div className={cn('group relative', isTextArea && 'col-span-2')}>
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    isTextArea ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none"
                            value={editValue}
                            onChange={(e) => handleFieldUpdate(field, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => handleKeyDown(e)}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            className="w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={editValue}
                            onChange={(e) => handleFieldUpdate(field, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => handleKeyDown(e)}
                        />
                    )
                ) : (
                    <div
                        className={cn(
                            'text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2',
                            isTextArea ? 'items-start whitespace-pre-line leading-relaxed' : 'items-center'
                        )}
                        onClick={() => handleEditClick(field, value)}
                    >
                        <span className={cn(!displayValue && 'text-slate-400 italic font-normal text-[12px]')}>{displayValue || 'Empty'}</span>
                        <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                )}
            </div>
        );
    };

    const renderCodeCellField = (label: string, field: keyof typeof localData, value: any) => {
        const isEditing = editingField === field;
        return (
            <div className="group relative">
                <FieldLabel>{label}</FieldLabel>
                {isEditing ? (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        className="w-full text-[12px] font-mono text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={editValue}
                        onChange={(e) => handleFieldUpdate(field, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                ) : (
                    <div
                        className="cursor-pointer flex items-center gap-2 group/val"
                        onClick={() => handleEditClick(field, value)}
                    >
                        {value ? (
                            <span className="font-mono text-[11.5px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-gray-700">
                                {value}
                            </span>
                        ) : (
                            <span className="text-slate-400 italic text-[12px]">Empty</span>
                        )}
                        <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
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
                <Cell full>
                    {renderCellField('Name', 'name', localData.name)}
                </Cell>

                <Cell>
                    <div className="group relative">
                        <FieldLabel>Sub Category</FieldLabel>
                        {editingField === 'subCategoryId' ? (
                            <Dropdown
                                label=""
                                options={subCategories?.map((sc: any) => ({ label: sc.name, value: String(sc.id) })) || []}
                                value={String(localData.subCategoryId || '')}
                                onChange={(val) => {
                                    const newSubCategoryId = parseInt(val, 10);
                                    setEditingField(null);
                                    updateField('subCategoryId', newSubCategoryId);
                                }}
                                placeholder="Select Sub Category"
                                searchable={true}
                            />
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditingField('subCategoryId')}>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                                    {subCategories?.find((sc: any) => sc.id === localData.subCategoryId)?.name
                                        || <span className="text-slate-400 italic font-normal text-[12px]">Not specified</span>}
                                </span>
                                <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </div>
                        )}
                    </div>
                </Cell>

                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <EditableStatusBadge
                        status={localData.isActive ? 'true' : 'false'}
                        options={[
                            { label: 'Active', value: 'true' },
                            { label: 'Inactive', value: 'false' }
                        ]}
                        onChange={(val) => updateField('isActive', val === 'true')}
                    />
                </Cell>

                <Cell>
                    {renderCellField('Price', 'basePrice', localData.basePrice, false, `₹${localData.basePrice}`)}
                </Cell>

                <Cell>
                    <FieldLabel>Featured</FieldLabel>
                    <EditableFeatureBadge
                        isFeatured={localData.isFeatured}
                        onChange={(val) => updateField('isFeatured', val)}
                    />
                </Cell>
            </FieldGrid>

            <SectionLabel>Identifiers</SectionLabel>
            <FieldGrid>
                <Cell>{renderCodeCellField('Slug', 'slug', localData.slug)}</Cell>
                <Cell>{renderCodeCellField('Tag Name', 'tagName', localData.tagName)}</Cell>
            </FieldGrid>

            {/* ── TIMING & CAPACITY ────────────────────── */}
            <SectionLabel>Timing & Capacity</SectionLabel>
            <FieldGrid>
                <Cell>
                    <FieldLabel>Duration</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('durationMinutes', localData.durationMinutes)}>
                        {editingField === 'durationMinutes' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => handleFieldUpdate('durationMinutes', e.target.value)} onBlur={() => setEditingField(null)} onKeyDown={e => handleKeyDown(e)} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{localData.durationMinutes || '—'}</span>
                                <span className="text-[11px] text-slate-400">min</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Completion Time</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('completionTime', localData.completionTime)}>
                        {editingField === 'completionTime' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => handleFieldUpdate('completionTime', e.target.value)} onBlur={() => setEditingField(null)} onKeyDown={e => handleKeyDown(e)} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{localData.completionTime || '—'}</span>
                                <span className="text-[11px] text-slate-400">min</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Min Hours</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('minHours', localData.minHours)}>
                        {editingField === 'minHours' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => handleFieldUpdate('minHours', e.target.value)} onBlur={() => setEditingField(null)} onKeyDown={e => handleKeyDown(e)} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{localData.minHours || '—'}</span>
                                <span className="text-[11px] text-slate-400">hrs</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell>
                    <FieldLabel>Max Capacity</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('maxCapacity', localData.maxCapacity)}>
                        {editingField === 'maxCapacity' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => handleFieldUpdate('maxCapacity', e.target.value)} onBlur={() => setEditingField(null)} onKeyDown={e => handleKeyDown(e)} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{localData.maxCapacity || '—'}</span>
                                <span className="text-[11px] text-slate-400">people</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
                <Cell full>
                    <FieldLabel>Min Age</FieldLabel>
                    <div className="flex items-baseline gap-1 cursor-pointer group" onClick={() => handleEditClick('minAge', localData.minAge)}>
                        {editingField === 'minAge' ? (
                            <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" className="w-full text-[13px] font-medium border border-blue-500 rounded-md px-2 py-0.5 outline-none" value={editValue} onChange={e => handleFieldUpdate('minAge', e.target.value)} onBlur={() => setEditingField(null)} onKeyDown={e => handleKeyDown(e)} />
                        ) : (
                            <>
                                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{localData.minAge || '—'}</span>
                                <span className="text-[11px] text-slate-400">yrs</span>
                                <svg className="w-3 h-3 ml-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </>
                        )}
                    </div>
                </Cell>
            </FieldGrid>

            <SectionLabel>Description</SectionLabel>
            <div className="flex flex-col gap-2">
                {(['shortDescription', 'description', 'whatToBring', 'termsConditions'] as const).map((field) => {
                    const labelMap: Record<string, string> = {
                        shortDescription: 'Short Description',
                        description: 'Description',
                        whatToBring: 'What To Bring',
                        termsConditions: 'Terms & Conditions',
                    };
                    const val = localData[field];
                    const isEditing = editingField === field;
                    // Only `description` is rich text; the other three stay plain textareas.
                    const isRichText = field === 'description';
                    const isBlank = isRichText ? isHtmlEmpty(val) : !val;
                    return (
                        <div key={field} className="group bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl px-3 py-3">
                            <FieldLabel>{labelMap[field]}</FieldLabel>
                            {isEditing ? (
                                isRichText ? (
                                    // The plain fields close on blur, but focus here moves between the
                                    // toolbar and the editable area, so editing ends via Done or Escape.
                                    <div className="space-y-2">
                                        <RichTextEditor
                                            autoFocus
                                            value={editValue}
                                            onChange={(html) => handleFieldUpdate(field, html)}
                                            onKeyDown={(e) => { if (e.key === 'Escape') setEditingField(null); }}
                                            className="min-h-[120px]"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setEditingField(null)}
                                                className="text-[12px] font-medium text-[var(--accent)] hover:underline"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                        className="w-full text-[13px] text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[80px] resize-none leading-relaxed"
                                        value={editValue}
                                        onChange={(e) => handleFieldUpdate(field, e.target.value)}
                                        onBlur={() => setEditingField(null)}
                                        onKeyDown={(e) => handleKeyDown(e)}
                                    />
                                )
                            ) : (
                                <div
                                    className="flex items-start gap-2 cursor-pointer"
                                    onClick={() => handleEditClick(field, val)}
                                >
                                    {isRichText ? (
                                        <div className="flex-1 min-w-0">
                                            <RichTextContent
                                                html={val}
                                                className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300"
                                                fallback={<p className="text-[13px] leading-relaxed text-slate-400 italic">Empty</p>}
                                            />
                                        </div>
                                    ) : (
                                        <p className={cn('text-[13px] leading-relaxed flex-1', isBlank ? 'text-slate-400 italic' : 'text-slate-600 dark:text-slate-300')}>
                                            {val || 'Empty'}
                                        </p>
                                    )}
                                    <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <TabFooter
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={handleFinalSave}
                onDiscard={handleDiscard}
                changes={displayChanges}
            />
        </div>
    );
};

export const getExperienceTabs = (params: ExperienceDetailsProps): SidePanelTab[] => {
    return [
        {
            id: TABS.GENERAL.id,
            label: TABS.GENERAL.label,
            content: (
                <GeneralInfoTab
                    experience={params.experience}
                    experienceDetail={params.experienceDetail}
                    updateExperience={params.updateExperience}
                    subCategories={params.subCategories}
                    onDirtyChange={params.onDirtyChange}
                />
            )
        },
        {
            id: TABS.INCLUSIONS.id,
            label: TABS.INCLUSIONS.label,
            content: (
                <InclusionsTab
                    inclusions={params.inclusions}
                    experienceDetail={params.experienceDetail}
                    onToggleInclusion={params.onToggleInclusion}
                />
            )
        },
        {
            id: TABS.LOCATIONS.id,
            label: TABS.LOCATIONS.label,
            content: (
                <LocationTab
                    availableLocations={params.locations}
                    experienceLocations={params.experienceDetail?.locations || []}
                    onAssociateLocation={params.onAssociateLocation}
                    onUpdateLocation={params.onUpdateLocation}
                    onDisassociateLocation={params.onDisassociateLocation}
                    onToggleExperienceLocation={params.onToggleExperienceLocation}
                    onAssociateLocationTimeSlot={params.onAssociateLocationTimeSlot}
                    onUpdateLocationTimeSlot={params.onUpdateLocationTimeSlot}
                    onDisassociateLocationTimeSlot={params.onDisassociateLocationTimeSlot}
                    onBulkAttachLocationTimeSlots={params.onBulkAttachLocationTimeSlots}
                    onToggleLocationTimeSlot={params.onToggleLocationTimeSlot}
                    slots={params.slots}
                />
            )
        },
        {
            id: TABS.POLICIES.id,
            label: TABS.POLICIES.label,
            content: (
                <CancellationPolicyTab
                    cancellationPolicies={params.cancellationPolicies}
                    experienceDetail={params.experienceDetail}
                    onToggleCancellationPolicy={params.onToggleCancellationPolicy}
                />
            )
        },
        {
            id: TABS.ADDONS.id,
            label: TABS.ADDONS.label,
            content: (
                <AddonsTab
                    experienceId={params.experienceDetail?.id}
                    availableAddons={params.addons}
                    experienceAddons={params.experienceAddons || []}
                    loading={params.addonsLoading}
                    getExperienceAddons={params.getExperienceAddons}
                    onToggleAddon={params.onToggleAddon}
                />
            )
        },
        {
            id: TABS.IMAGES.id,
            label: TABS.IMAGES.label,
            content: (
                <ExperienceImages
                    experienceId={params.experienceDetail?.id}
                    experienceMedia={params.experienceMedia}
                    getExperienceMedia={params.getExperienceMedia}
                    availableImages={params.images}
                    getImages={params.getImages}
                    bulkAttachMedia={params.bulkAttachMedia}
                    disassociateMedia={params.disassociateMedia}
                    setPrimaryMedia={params.setPrimaryMedia}
                    updateMediaAttachment={params.updateMediaAttachment}
                    toggleMediaActive={params.toggleMediaActive}
                    uploadExperienceMedia={params.uploadExperienceMedia}
                />
            )
        }
    ];
};
