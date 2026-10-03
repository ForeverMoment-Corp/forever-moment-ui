import { useEffect, useRef, useState } from 'react';
import { ImageIcon, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SectionLabel } from '@/components/common/DetailsLayout';
import { getMediaAssetUrl } from '@/features/images/store/api';
import type { AddonType } from '@/features/addon/store/action-types';
import { cn } from '@/utils/cn';

interface AddonImageProps {
    addon: AddonType;
    uploadAddonImage: (id: number, file: File, metadata?: Record<string, any>) => Promise<any>;
    removeAddonImage: (addon: AddonType) => Promise<any>;
}

const MAX_SIZE_MB = 10;

export const heroSrc = (addon: Partial<AddonType>) =>
    getMediaAssetUrl(addon.heroUrl || addon.originalUrl || addon.thumbnailUrl);

export const thumbSrc = (addon: Partial<AddonType>) =>
    getMediaAssetUrl(addon.thumbnailUrl || addon.heroUrl || addon.originalUrl);

/**
 * Single-image panel for an add-on. One image is attached per add-on via
 * POST /admin/addons/{id}/image/upload (multipart, field `file`); picking a new file
 * replaces the current one.
 */
export const AddonImage = ({ addon, uploadAddonImage, removeAddonImage }: AddonImageProps) => {
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [altText, setAltText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentSrc = heroSrc(addon);
    const hasImage = Boolean(addon.mediaId || currentSrc);

    // Clear any pending selection when switching add-ons.
    useEffect(() => {
        clearPending();
    }, [addon.id]);

    // Revoke object URLs so previews don't leak.
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const clearPending = () => {
        setPendingFile(null);
        setPreview('');
        setAltText('');
        setValidationError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const pickFile = (file?: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setValidationError('Only image files are allowed.');
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setValidationError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
            return;
        }
        setValidationError(null);
        setPendingFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        pickFile(e.target.files?.[0]);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const handleUpload = async () => {
        if (!pendingFile) return;
        setIsUploading(true);
        try {
            const metadata: Record<string, any> = { category: 'addons', label: addon.name };
            if (altText.trim()) metadata.altText = altText.trim();
            await uploadAddonImage(addon.id, pendingFile, metadata);
            clearPending();
        } catch (error) {
            console.error('Failed to upload addon image:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            await removeAddonImage(addon);
        } catch (error) {
            console.error('Failed to remove addon image:', error);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div>
            <SectionLabel>Image</SectionLabel>

            {/* ── Current image ─────────────────────────── */}
            <div className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl p-3 mb-4">
                {hasImage ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-56 aspect-video shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <img
                                src={currentSrc}
                                alt={addon.name || 'Add-on image'}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                            <div>
                                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">Current image</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Shown wherever this add-on is listed. Pick a new file below to replace it.
                                </p>
                                {addon.mediaId != null && (
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Media ID: {addon.mediaId}</p>
                                )}
                            </div>
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemove}
                                    isLoading={isRemoving}
                                    disabled={isUploading}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700"
                                >
                                    <Trash2 size={14} />
                                    Remove image
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <div className="h-12 w-12 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                            <ImageIcon size={20} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-200">No image yet</p>
                            <p className="text-xs">Upload one below to give this add-on a visual.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Upload / replace ─────────────────────── */}
            <SectionLabel>{hasImage ? 'Replace image' : 'Upload image'}</SectionLabel>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    'rounded-xl border-2 border-dashed p-3 transition-colors',
                    isDragging
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10'
                        : 'border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 hover:border-blue-500'
                )}
            >
                {pendingFile && preview ? (
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative w-full sm:w-56 aspect-video shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <img src={preview} alt="Selected preview" className="h-full w-full object-contain" />
                                <button
                                    type="button"
                                    onClick={clearPending}
                                    disabled={isUploading}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                                    aria-label="Discard selected file"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">{pendingFile.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{(pendingFile.size / 1024).toFixed(0)} KB</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Alt text (optional)</label>
                                    <input
                                        type="text"
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        placeholder="Describe the image"
                                        disabled={isUploading}
                                        className="w-full text-[13px] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" size="sm" onClick={clearPending} disabled={isUploading}>
                                Cancel
                            </Button>
                            <Button type="button" size="sm" onClick={handleUpload} isLoading={isUploading}>
                                <Upload size={14} />
                                {hasImage ? 'Replace image' : 'Upload image'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer w-full py-2">
                        <Upload size={28} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Click to upload or drag and drop</span>
                        <span className="text-xs text-slate-400">PNG, JPG or WebP, up to {MAX_SIZE_MB} MB</span>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleInputChange}
                        />
                    </label>
                )}
            </div>
            {validationError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">{validationError}</p>
            )}
        </div>
    );
};
