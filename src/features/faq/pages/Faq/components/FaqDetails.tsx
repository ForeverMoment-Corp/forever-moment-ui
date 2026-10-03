import { useState, useRef, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { TabFooter } from '@/components/common/TabFooter';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { FaqPayload } from '@/features/faq/store/api';
import type { FaqType } from './Faq';

interface FaqDetailsProps {
    faq: FaqType;
    updateFaq: (id: number, data: FaqPayload) => Promise<any>;
    onDirtyChange?: (isDirty: boolean, changes: any[]) => void;
}

const PencilIcon = () => (
    <svg className="w-3 h-3 mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
);

const editorClassName = "w-full text-[13px] font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-blue-500 rounded-md px-2 py-1 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all";

export const FaqDetails = ({ faq, updateFaq, onDirtyChange }: FaqDetailsProps) => {
    const [editingField, setEditingField] = useState<'question' | 'answer' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const consolidatedData = useMemo(() => ({
        question: faq.question || '',
        answer: faq.answer || '',
        isActive: faq.isActive ?? true,
    }), [faq]);

    const fieldMapping = useMemo(() => ({
        question: 'Question',
        answer: 'Answer',
        isActive: 'Status'
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Enter commits a single-line question; the answer textarea keeps newlines
        if (e.key === 'Escape' || (e.key === 'Enter' && editingField === 'question')) {
            setEditingField(null);
        }
    };

    const handleSave = async () => {
        if (!localData.question.trim() || !localData.answer.trim()) {
            toast.error('Question and answer are required');
            return;
        }
        setIsSaving(true);
        try {
            await updateFaq(faq.id, {
                question: localData.question.trim(),
                answer: localData.answer.trim(),
                isActive: localData.isActive,
                displayOrder: faq.displayOrder,
            });
            toast.success('FAQ updated successfully');
        } catch (e) {
            console.error('Failed to update FAQ', e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <SectionLabel>FAQ Details</SectionLabel>
            <FieldGrid>
                <Cell full>
                    <div className="group relative">
                        <FieldLabel>Question</FieldLabel>
                        {editingField === 'question' ? (
                            <input
                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                className={editorClassName}
                                value={localData.question}
                                onChange={(e) => updateField('question', e.target.value)}
                                onBlur={() => setEditingField(null)}
                                onKeyDown={handleKeyDown}
                            />
                        ) : (
                            <div
                                className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2 items-start"
                                onClick={() => setEditingField('question')}
                            >
                                <span className={cn(!localData.question && 'text-slate-400 italic font-normal')}>
                                    {localData.question || 'Empty'}
                                </span>
                                <PencilIcon />
                            </div>
                        )}
                    </div>
                </Cell>

                <Cell full>
                    <div className="group relative">
                        <FieldLabel>Answer</FieldLabel>
                        {editingField === 'answer' ? (
                            <textarea
                                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                className={cn(editorClassName, 'min-h-[140px]')}
                                value={localData.answer}
                                onChange={(e) => updateField('answer', e.target.value)}
                                onBlur={() => setEditingField(null)}
                                onKeyDown={handleKeyDown}
                            />
                        ) : (
                            <div
                                className="text-[13px] font-medium text-gray-900 dark:text-gray-100 cursor-pointer flex gap-2 items-start"
                                onClick={() => setEditingField('answer')}
                            >
                                <span className={cn('whitespace-pre-wrap', !localData.answer && 'text-slate-400 italic font-normal')}>
                                    {localData.answer || 'Empty'}
                                </span>
                                <PencilIcon />
                            </div>
                        )}
                    </div>
                </Cell>

                <Cell>
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex items-center -ml-2 mt-1">
                        <EditableStatusBadge
                            status={localData.isActive ? 'true' : 'false'}
                            options={[
                                { label: 'Active', value: 'true' },
                                { label: 'Inactive', value: 'false' }
                            ]}
                            onChange={(val) => updateField('isActive', val === 'true')}
                        />
                    </div>
                </Cell>

                <Cell>
                    <FieldLabel>Display Order</FieldLabel>
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{faq.displayOrder}</p>
                </Cell>

                <Cell>
                    <FieldLabel>ID</FieldLabel>
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">#{faq.id}</p>
                </Cell>

                <Cell>
                    <FieldLabel>Last Updated</FieldLabel>
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                        {faq.updatedOn || faq.createdOn ? formatDate((faq.updatedOn || faq.createdOn) as string) : '-'}
                    </p>
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
