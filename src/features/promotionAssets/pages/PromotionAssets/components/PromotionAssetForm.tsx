import React, { useEffect, useMemo, useState } from 'react';
import { ImageIcon, RefreshCw } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { MediaPicker } from './MediaPicker';
import { getMediaAssetUrl } from '@/features/images/store/api';
import type { PromotionAssetPayload, PromotionAssetType } from '@/features/promotionAssets/store/action-types';
import { heroSrc, toApiDateTime, toInputDateTime, validatePayload } from '@/features/promotionAssets/store/utils';
import { cn } from '@/utils/cn';
import { NumberInput } from '@/components/common/NumberInput';

interface PromotionAssetFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PromotionAssetPayload) => Promise<any> | void;
    initialData?: PromotionAssetType | null;
    availableImages: any[];
    imagesLoading?: boolean;
    /** Placements already in use, offered as suggestions. */
    placements?: string[];
}

interface FormState {
    mediaId: number | null;
    promoKey: string;
    placement: string;
    title: string;
    altTextOverride: string;
    startAt: string;
    endAt: string;
    priority: number;
    isActive: boolean;
}

const emptyForm: FormState = {
    mediaId: null,
    promoKey: '',
    placement: '',
    title: '',
    altTextOverride: '',
    startAt: '',
    endAt: '',
    priority: 100,
    isActive: true,
};

const inputClass = (hasError?: boolean) => cn(
    'w-full bg-slate-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-[13.5px] outline-none focus:ring-2 focus:ring-[var(--accent-ring)] focus:border-[var(--accent)] text-slate-900 dark:text-white',
    hasError ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-gray-700'
);

const Field = ({ label, htmlFor, required, hint, error, children }: {
    label: string; htmlFor: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}{required && <span className="text-red-500"> *</span>}
        </label>
        {children}
        {error
            ? <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
            : hint ? <p className="text-xs text-slate-400 mt-1">{hint}</p> : null}
    </div>
);

export const PromotionAssetForm: React.FC<PromotionAssetFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    availableImages,
    imagesLoading,
    placements = [],
}) => {
    const [form, setForm] = useState<FormState>(emptyForm);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setErrors({});
        setIsSubmitting(false);
        if (initialData) {
            setForm({
                mediaId: initialData.mediaId ?? null,
                promoKey: initialData.promoKey || '',
                placement: initialData.placement || '',
                title: initialData.title || '',
                altTextOverride: initialData.altTextOverride || '',
                startAt: toInputDateTime(initialData.startAt),
                endAt: toInputDateTime(initialData.endAt),
                priority: initialData.priority ?? 100,
                isActive: initialData.isActive ?? true,
            });
            setSelectedImage(null);
            setShowPicker(false);
        } else {
            setForm(emptyForm);
            setSelectedImage(null);
            // New asset: the image is the one thing that has no default, so open the picker.
            setShowPicker(true);
        }
    }, [initialData, isOpen]);

    // Preview source: the picked library image wins, otherwise the asset's own hero URL.
    const previewSrc = useMemo(() => {
        if (selectedImage) return getMediaAssetUrl(selectedImage.thumbnailUrl || selectedImage.mediaUrl || selectedImage.url);
        if (initialData && form.mediaId === initialData.mediaId) return heroSrc(initialData);
        return '';
    }, [selectedImage, initialData, form.mediaId]);

    const previewName = selectedImage?.fileName || (initialData && form.mediaId === initialData.mediaId ? initialData.fileName : '') || '';

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
    };

    const buildPayload = (): PromotionAssetPayload => ({
        mediaId: form.mediaId,
        promoKey: form.promoKey.trim(),
        placement: form.placement.trim(),
        title: form.title.trim() || null,
        altTextOverride: form.altTextOverride.trim() || null,
        startAt: toApiDateTime(form.startAt || null),
        endAt: toApiDateTime(form.endAt || null),
        priority: Number(form.priority),
        isActive: form.isActive,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = buildPayload();
        const validation = validatePayload(payload);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            if (validation.mediaId) setShowPicker(true);
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(payload);
        } catch {
            // The container surfaces the API error via toast; keep the modal open for a retry.
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePick = (img: any) => {
        setSelectedImage(img);
        setField('mediaId', Number(img.id));
        setShowPicker(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Promotion Asset' : 'Create Promotion Asset'}
            description="A scheduled banner image served by promotion key and placement."
            className="max-w-3xl w-[95vw]"
        >
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh]">
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5">
                    {/* ── Image ───────────────────────────────── */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Image<span className="text-red-500"> *</span>
                            </span>
                            {form.mediaId != null && (
                                <button
                                    type="button"
                                    onClick={() => setShowPicker((v) => !v)}
                                    className="text-[12.5px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                                >
                                    <RefreshCw size={12} />
                                    {showPicker ? 'Keep current image' : 'Change image'}
                                </button>
                            )}
                        </div>

                        <div className={cn(
                            'flex items-center gap-4 rounded-xl border p-3 bg-slate-50 dark:bg-gray-800/50',
                            errors.mediaId ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-gray-700'
                        )}>
                            <div className="h-16 w-28 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
                                {previewSrc
                                    ? <img src={previewSrc} alt={previewName || 'Selected image'} className="h-full w-full object-cover" />
                                    : <ImageIcon size={20} className="text-slate-400" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                {form.mediaId != null ? (
                                    <>
                                        <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">{previewName || `Media #${form.mediaId}`}</p>
                                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">Media ID: {form.mediaId}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[13px] font-medium text-slate-700 dark:text-slate-200">No image selected</p>
                                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">Pick one from the media library below.</p>
                                    </>
                                )}
                            </div>
                        </div>
                        {errors.mediaId && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.mediaId}</p>}

                        {showPicker && (
                            <MediaPicker
                                className="mt-3 h-[260px]"
                                images={availableImages}
                                loading={imagesLoading}
                                selectedId={form.mediaId}
                                onSelect={handlePick}
                            />
                        )}
                    </div>

                    {/* ── Targeting ───────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Promotion key" htmlFor="promoKey" required error={errors.promoKey}
                            hint="Lower-cased by the server. The public site requests banners by this key.">
                            <input
                                id="promoKey"
                                type="text"
                                value={form.promoKey}
                                onChange={(e) => setField('promoKey', e.target.value)}
                                maxLength={100}
                                placeholder="e.g. diwali-sale"
                                className={cn(inputClass(!!errors.promoKey), 'font-mono')}
                            />
                        </Field>
                        <Field label="Placement" htmlFor="placement" required error={errors.placement}
                            hint="Where the banner renders, e.g. home-hero, checkout-strip.">
                            <input
                                id="placement"
                                type="text"
                                list="promotion-asset-placements"
                                value={form.placement}
                                onChange={(e) => setField('placement', e.target.value)}
                                maxLength={40}
                                placeholder="e.g. home-hero"
                                className={inputClass(!!errors.placement)}
                            />
                            <datalist id="promotion-asset-placements">
                                {placements.map((p) => <option key={p} value={p} />)}
                            </datalist>
                        </Field>
                    </div>

                    <Field label="Title" htmlFor="title" error={errors.title} hint="Internal label shown in this admin list.">
                        <input
                            id="title"
                            type="text"
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            maxLength={120}
                            placeholder="e.g. Diwali hero banner (desktop)"
                            className={inputClass(!!errors.title)}
                        />
                    </Field>

                    {/* ── Schedule ────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Starts at" htmlFor="startAt" error={errors.startAt} hint="Leave empty to start immediately.">
                            <input
                                id="startAt"
                                type="datetime-local"
                                value={form.startAt}
                                onChange={(e) => setField('startAt', e.target.value)}
                                className={inputClass(!!errors.startAt)}
                            />
                        </Field>
                        <Field label="Ends at" htmlFor="endAt" error={errors.endAt} hint="Leave empty to run indefinitely.">
                            <input
                                id="endAt"
                                type="datetime-local"
                                value={form.endAt}
                                min={form.startAt || undefined}
                                onChange={(e) => setField('endAt', e.target.value)}
                                className={inputClass(!!errors.endAt)}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Priority" htmlFor="priority" error={errors.priority} hint="Lower numbers are served first when several assets match.">
                            <NumberInput
                                id="priority"
                                step={1}
                                value={form.priority}
                                onChange={(e) => setField('priority', e.target.value === '' ? 0 : Number(e.target.value))}
                                className={inputClass(!!errors.priority)}
                            />
                        </Field>
                        <div className="flex items-end">
                            <div className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
                                <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Active</div>
                                    <div className="text-xs text-slate-500">Inactive assets are never served publicly</div>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setField('isActive', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <Field label="Alt text override" htmlFor="altTextOverride" error={errors.altTextOverride}
                        hint="Optional. Replaces the media record's own alt text for this placement.">
                        <textarea
                            id="altTextOverride"
                            value={form.altTextOverride}
                            onChange={(e) => setField('altTextOverride', e.target.value)}
                            maxLength={300}
                            rows={2}
                            placeholder="Describe the banner for screen readers"
                            className={cn(inputClass(!!errors.altTextOverride), 'resize-none')}
                        />
                    </Field>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-800 mt-5 shrink-0">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
