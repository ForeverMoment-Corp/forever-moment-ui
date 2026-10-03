import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Trash2, Image as ImageIcon, CheckCircle2, Grid, List, Star, ArrowUpDown, GripVertical, Eye, EyeOff, Plus, Loader2, AlertTriangle, Upload, X, Library } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shape of one row from a catalog media endpoint — GET /admin/experiences/{id}/media,
 * /admin/categories/{id}/media or /admin/subcategories/{id}/media. All three return the
 * same ExperienceMediaResponseDto shape.
 */
export interface MediaAttachmentItem {
    mapperId?: number;
    id?: number; // legacy alias, some responses used `id` instead of `mapperId`
    mediaId: number;
    fileName?: string;
    mimeType?: string;
    fileSizeBytes?: number;
    url?: string;
    heroUrl?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    displayOrder?: number;
    isPrimary?: boolean;
    altText?: string;
    isActive?: boolean;
    uploadDate?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'order' | 'name' | 'date';
type AddTab = 'library' | 'upload';

interface PendingUpload {
    file: File;
    preview: string;
    altText: string;
}

const MAX_UPLOAD_MB = 10;

/** Stable row key: the backend returns `mapperId`; fall back to `id`, then `mediaId`. */
const keyOf = (em: MediaAttachmentItem): number => em.mapperId ?? em.id ?? em.mediaId;

const labelOf = (em: MediaAttachmentItem) => em.altText || em.fileName || `Image #${em.mediaId}`;

const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const thumbSrc = (em: MediaAttachmentItem) => getMediaAssetUrl(em.thumbnailUrl || em.url || em.originalUrl);
const heroSrc = (em: MediaAttachmentItem) => getMediaAssetUrl(em.heroUrl || em.url || em.originalUrl);

// ─────────────────────────────────────────────────────────────────────────────
// Small presentational pieces
// ─────────────────────────────────────────────────────────────────────────────

const IconAction = ({
    title, onClick, disabled, active, danger, children,
}: {
    title: string;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
    active?: boolean;
    danger?: boolean;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        title={title}
        aria-label={title}
        disabled={disabled}
        onClick={onClick}
        className={cn(
            "h-7 w-7 inline-flex items-center justify-center rounded-md border text-slate-600 bg-white/95 backdrop-blur shadow-sm transition-all",
            "dark:bg-gray-900/90 dark:text-slate-300 dark:border-gray-700 border-slate-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            active && "text-amber-500 border-amber-300 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/40",
            danger
                ? "hover:text-red-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
                : !active && "hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
        )}
    >
        {children}
    </button>
);

const PrimaryBadge = ({ compact = false }: { compact?: boolean }) => (
    <span className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide text-white shadow-sm",
        "bg-[var(--accent)]",
        compact ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1"
    )}>
        <Star size={compact ? 10 : 12} className="fill-current" />
        Cover
    </span>
);

const HiddenBadge = () => (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">
        <EyeOff size={10} />
        Hidden
    </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// Sortable image card / row
// ─────────────────────────────────────────────────────────────────────────────

interface SortableImageItemProps {
    em: MediaAttachmentItem;
    viewMode: ViewMode;
    canDrag: boolean;
    busy: boolean;
    onSetPrimary: (em: MediaAttachmentItem) => void;
    onToggleActive: (em: MediaAttachmentItem) => void;
    onRemove: (em: MediaAttachmentItem) => void;
}

const SortableImageItem = ({ em, viewMode, canDrag, busy, onSetPrimary, onToggleActive, onRemove }: SortableImageItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: keyOf(em),
        disabled: !canDrag,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 20 : undefined,
    };

    const isPrimary = !!em.isPrimary;
    const isHidden = em.isActive === false;

    const actions = (
        <>
            <IconAction
                title={isPrimary ? 'This is the cover image' : 'Set as cover image'}
                active={isPrimary}
                disabled={busy || isPrimary}
                onClick={(e) => { e.stopPropagation(); onSetPrimary(em); }}
            >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} className={cn(isPrimary && 'fill-current')} />}
            </IconAction>
            <IconAction
                title={isHidden ? 'Show image' : 'Hide image'}
                disabled={busy}
                onClick={(e) => { e.stopPropagation(); onToggleActive(em); }}
            >
                {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </IconAction>
            <IconAction
                title="Remove image"
                danger
                disabled={busy}
                onClick={(e) => { e.stopPropagation(); onRemove(em); }}
            >
                <Trash2 size={14} />
            </IconAction>
        </>
    );

    const dragHandle = canDrag && (
        <button
            type="button"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
            aria-label="Drag to reorder"
            className={cn(
                "h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white/95 text-slate-500 shadow-sm",
                "dark:bg-gray-900/90 dark:border-gray-700 dark:text-slate-300",
                "cursor-grab active:cursor-grabbing touch-none"
            )}
        >
            <GripVertical size={14} />
        </button>
    );

    if (viewMode === 'grid') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    "group relative flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden transition-all",
                    "dark:bg-gray-900 dark:border-gray-800",
                    isPrimary
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent-ring)]"
                        : "border-slate-200 hover:border-[var(--accent)]/60 hover:shadow-md",
                    isHidden && "opacity-70"
                )}
            >
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-gray-800 overflow-hidden">
                    {thumbSrc(em) ? (
                        <img
                            src={thumbSrc(em)}
                            alt={em.altText || em.fileName || 'Attached image'}
                            loading="lazy"
                            className={cn(
                                "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",
                                isHidden && "grayscale"
                            )}
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        </div>
                    )}

                    {/* top-left: status */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        {isPrimary && <PrimaryBadge compact />}
                        {isHidden && <HiddenBadge />}
                    </div>

                    {/* top-right: actions (always visible when busy, otherwise on hover) */}
                    <div className={cn(
                        "absolute top-2 right-2 flex items-center gap-1 transition-opacity",
                        busy ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
                    )}>
                        {actions}
                    </div>

                    {/* bottom-left: drag handle */}
                    {canDrag && (
                        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            {dragHandle}
                        </div>
                    )}

                    {/* bottom-right: order chip */}
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 tabular-nums">
                        #{(em.displayOrder ?? 0) + 1}
                    </div>
                </div>

                <div className="px-3 py-2 border-t border-slate-100 dark:border-gray-800">
                    <div className="text-[12.5px] font-medium text-slate-800 dark:text-slate-200 truncate" title={labelOf(em)}>
                        {labelOf(em)}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {[em.mimeType?.replace('image/', '').toUpperCase(), formatBytes(em.fileSizeBytes)].filter(Boolean).join(' · ') || ' '}
                    </div>
                </div>
            </div>
        );
    }

    // ── list row
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-all",
                "dark:bg-gray-900 dark:border-gray-800",
                isPrimary
                    ? "border-[var(--accent)] ring-1 ring-[var(--accent-ring)]"
                    : "border-slate-200 hover:border-[var(--accent)]/60 hover:shadow-sm",
                isHidden && "opacity-70"
            )}
        >
            {canDrag ? dragHandle : <span className="w-7" />}

            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-gray-800">
                {thumbSrc(em) ? (
                    <img src={thumbSrc(em)} alt={em.altText || em.fileName || ''} loading="lazy" className={cn("h-full w-full object-cover", isHidden && "grayscale")} />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate" title={labelOf(em)}>
                        {labelOf(em)}
                    </span>
                    {isPrimary && <PrimaryBadge compact />}
                    {isHidden && <HiddenBadge />}
                </div>
                <div className="mt-0.5 text-[11.5px] text-slate-400 dark:text-slate-500 truncate">
                    {[`Order ${(em.displayOrder ?? 0) + 1}`, em.mimeType, formatBytes(em.fileSizeBytes)].filter(Boolean).join(' · ')}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {actions}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main tab
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wording that differs per owner type. Everything else in the gallery is identical
 * for experiences, categories and sub-categories.
 */
export interface MediaGalleryCopy {
    /** Lower-case singular noun used in sentences, e.g. "experience", "category". */
    ownerLabel: string;
    /** Value sent as the storage `category` metadata on upload, e.g. "categories". */
    uploadCategory: string;
    /** One line under the cover image explaining where it shows up. */
    coverDescription: string;
}

interface MediaGalleryTabProps {
    ownerId: number;
    copy: MediaGalleryCopy;
    media: MediaAttachmentItem[];
    getMedia: (ownerId: number) => Promise<any>;
    availableImages: any[];
    getImages: () => void;
    attachMedia: (ownerId: number, data: { items: any[] }) => Promise<any>;
    detachMedia: (ownerId: number, mediaId: number) => Promise<any>;
    setPrimaryMedia?: (ownerId: number, mediaId: number, current?: MediaAttachmentItem) => Promise<any>;
    updateMediaAttachment?: (ownerId: number, mediaId: number, data: any) => Promise<any>;
    toggleMediaActive?: (ownerId: number, mapperId: number) => Promise<any>;
    /** Direct upload: POST {basePath}/{id}/media/upload (multipart `file` + JSON `attach`). */
    uploadMedia?: (
        ownerId: number,
        file: File,
        attach?: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean },
        metadata?: Record<string, any>,
        refresh?: boolean
    ) => Promise<any>;
}

export const MediaGalleryTab: React.FC<MediaGalleryTabProps> = ({
    ownerId,
    copy,
    media,
    getMedia,
    availableImages,
    getImages,
    attachMedia,
    detachMedia,
    setPrimaryMedia,
    updateMediaAttachment,
    toggleMediaActive,
    uploadMedia,
}) => {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortBy>('order');
    const [orderedMedia, setOrderedMedia] = useState<MediaAttachmentItem[]>([]);
    const [busyMediaId, setBusyMediaId] = useState<number | null>(null);
    const [pendingRemove, setPendingRemove] = useState<MediaAttachmentItem | null>(null);

    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [addTab, setAddTab] = useState<AddTab>('library');
    const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Direct upload state
    const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const canUpload = typeof uploadMedia === 'function';
    // True while the media list for *this* owner is being (re)loaded.
    const [isFetching, setIsFetching] = useState(false);

    // Revoke preview object URLs when the component unmounts.
    useEffect(() => {
        return () => { pendingUploads.forEach(pu => URL.revokeObjectURL(pu.preview)); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep a local, sorted copy (never mutate the Redux array in place).
    useEffect(() => {
        const list = Array.isArray(media) ? [...media] : [];
        list.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
        setOrderedMedia(list);
    }, [media]);

    useEffect(() => {
        if (!ownerId) return;
        let cancelled = false;
        setIsFetching(true);
        Promise.resolve(getMedia(ownerId))
            .catch(() => undefined) // the action already surfaces the error
            .finally(() => { if (!cancelled) setIsFetching(false); });
        return () => { cancelled = true; };
    }, [ownerId, getMedia]);

    const primary = useMemo(() => orderedMedia.find(em => em.isPrimary) || null, [orderedMedia]);
    const hiddenCount = useMemo(() => orderedMedia.filter(em => em.isActive === false).length, [orderedMedia]);

    const visibleMedia = useMemo(() => {
        const q = search.trim().toLowerCase();
        const filtered = orderedMedia.filter(em => {
            if (!q) return true;
            return [em.altText, em.fileName, em.mimeType].some(v => v?.toLowerCase().includes(q));
        });
        if (sortBy === 'name') filtered.sort((a, b) => (a.fileName || '').localeCompare(b.fileName || ''));
        else if (sortBy === 'date') filtered.sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime());
        return filtered;
    }, [orderedMedia, search, sortBy]);

    // Reordering only makes sense when the full list is shown in display order.
    const canDrag = sortBy === 'order' && !search && orderedMedia.length > 1;

    // ── DnD
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = orderedMedia.findIndex(em => keyOf(em) === active.id);
        const newIndex = orderedMedia.findIndex(em => keyOf(em) === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const previous = orderedMedia;
        const reordered = arrayMove(orderedMedia, oldIndex, newIndex).map((em, index) => ({ ...em, displayOrder: index }));
        setOrderedMedia(reordered);

        if (!updateMediaAttachment) return;

        // Persist only the rows whose displayOrder actually changed.
        const changed = reordered.filter((em, index) => (previous.find(p => keyOf(p) === keyOf(em))?.displayOrder ?? index) !== em.displayOrder);
        if (changed.length === 0) return;

        try {
            for (const em of changed) {
                await updateMediaAttachment(ownerId, em.mediaId, { displayOrder: em.displayOrder });
            }
            toast.success('Image order updated');
        } catch {
            toast.error('Could not save the new order');
            setOrderedMedia(previous);
        }
    };

    // ── Row actions
    const handleSetPrimary = useCallback(async (em: MediaAttachmentItem) => {
        if (!setPrimaryMedia || em.isPrimary) return;
        setBusyMediaId(em.mediaId);
        try {
            await setPrimaryMedia(ownerId, em.mediaId, em);
            toast.success(`"${labelOf(em)}" is now the cover image`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to set cover image');
        } finally {
            setBusyMediaId(null);
        }
    }, [ownerId, setPrimaryMedia]);

    const handleToggleActive = useCallback(async (em: MediaAttachmentItem) => {
        const mapperId = em.mapperId ?? em.id;
        if (!toggleMediaActive || mapperId == null) return;
        if (em.isPrimary && em.isActive !== false) {
            toast.error('The cover image cannot be hidden. Choose another cover first.');
            return;
        }
        setBusyMediaId(em.mediaId);
        try {
            await toggleMediaActive(ownerId, mapperId);
            toast.success(em.isActive === false ? 'Image is now visible' : 'Image hidden');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update image');
        } finally {
            setBusyMediaId(null);
        }
    }, [ownerId, toggleMediaActive]);

    const handleConfirmRemove = async () => {
        if (!pendingRemove) return;
        const em = pendingRemove;
        setBusyMediaId(em.mediaId);
        try {
            await detachMedia(ownerId, em.mediaId);
            await getMedia(ownerId);
            toast.success(`Image removed from ${copy.ownerLabel}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to remove image');
        } finally {
            setBusyMediaId(null);
            setPendingRemove(null);
        }
    };

    // ── Add-images modal
    const unassignedImages = useMemo(
        () => (availableImages || []).filter((img: any) => !orderedMedia.some(em => em.mediaId === img.id)),
        [availableImages, orderedMedia]
    );

    const handleOpenAssocModal = (tab: AddTab = 'library') => {
        getImages();
        setSelectedImageIds([]);
        setAddTab(canUpload ? tab : 'library');
        setIsAssocModalOpen(true);
    };

    const clearPendingUploads = () => {
        setPendingUploads(prev => {
            prev.forEach(pu => URL.revokeObjectURL(pu.preview));
            return [];
        });
        setUploadError(null);
    };

    const handleCloseModal = () => {
        if (uploadProgress) return; // don't close mid-upload
        setIsAssocModalOpen(false);
        setSelectedImageIds([]);
        clearPendingUploads();
    };

    // ── Direct upload
    const addFiles = (files: FileList | File[] | null | undefined) => {
        const list = Array.from(files || []);
        if (list.length === 0) return;
        const rejected: string[] = [];
        const accepted: PendingUpload[] = [];
        list.forEach(file => {
            if (!file.type.startsWith('image/')) { rejected.push(`${file.name} is not an image`); return; }
            if (file.size > MAX_UPLOAD_MB * 1024 * 1024) { rejected.push(`${file.name} is larger than ${MAX_UPLOAD_MB} MB`); return; }
            accepted.push({ file, preview: URL.createObjectURL(file), altText: '' });
        });
        if (accepted.length) setPendingUploads(prev => [...prev, ...accepted]);
        setUploadError(rejected.length ? rejected.join('. ') : null);
    };

    const removePending = (index: number) => {
        setPendingUploads(prev => {
            const target = prev[index];
            if (target) URL.revokeObjectURL(target.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const setPendingAlt = (index: number, altText: string) =>
        setPendingUploads(prev => prev.map((pu, i) => (i === index ? { ...pu, altText } : pu)));

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleUploadSubmit = async () => {
        if (!uploadMedia || pendingUploads.length === 0 || !ownerId) return;
        setIsSubmitting(true);
        setUploadError(null);
        const total = pendingUploads.length;
        const startOrder = orderedMedia.length;
        let done = 0;
        const failures: string[] = [];
        setUploadProgress({ done, total });

        for (let index = 0; index < pendingUploads.length; index++) {
            const pu = pendingUploads[index];
            const attach = {
                displayOrder: startOrder + index,
                isPrimary: !primary && index === 0, // first upload becomes cover only if there is none yet
                altText: pu.altText.trim() || undefined,
                isActive: true,
            };
            const metadata: Record<string, any> = { category: copy.uploadCategory };
            if (pu.altText.trim()) metadata.altText = pu.altText.trim();
            try {
                await uploadMedia(ownerId, pu.file, attach, metadata, false);
            } catch (error: any) {
                failures.push(`${pu.file.name}: ${error?.response?.data?.message || 'upload failed'}`);
            }
            done += 1;
            setUploadProgress({ done, total });
        }

        try {
            await getMedia(ownerId);
        } catch { /* list refresh is best-effort; the next open will refetch */ }

        setUploadProgress(null);
        setIsSubmitting(false);

        const uploaded = total - failures.length;
        if (uploaded > 0) toast.success(`${uploaded} image${uploaded === 1 ? '' : 's'} uploaded`);
        if (failures.length) {
            toast.error(`${failures.length} upload${failures.length === 1 ? '' : 's'} failed`);
            setUploadError(failures.join('. '));
            // Keep only the failed files so the user can retry them.
            const failedNames = new Set(failures.map(f => f.split(':')[0]));
            setPendingUploads(prev => prev.filter(pu => failedNames.has(pu.file.name)));
            return;
        }
        clearPendingUploads();
        setIsAssocModalOpen(false);
    };

    const toggleImageSelection = (id: number) =>
        setSelectedImageIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

    const handleSubmit = async () => {
        if (selectedImageIds.length === 0 || !ownerId) return;
        setIsSubmitting(true);
        const startOrder = orderedMedia.length;
        const items = selectedImageIds.map((id, index) => ({
            mediaId: id,
            displayOrder: startOrder + index,
            isPrimary: !primary && index === 0, // first pick becomes cover only if there is none yet
            altText: '',
            isActive: true,
        }));
        try {
            await attachMedia(ownerId, { items });
            await getMedia(ownerId);
            toast.success(`${items.length} image${items.length === 1 ? '' : 's'} added`);
            handleCloseModal();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to add images');
        } finally {
            setIsSubmitting(false);
        }
    };

    const total = orderedMedia.length;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">Images</h3>
                    <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {total === 0
                            ? (isFetching ? 'Loading images…' : 'No images attached yet.')
                            : `${total} image${total === 1 ? '' : 's'}${hiddenCount ? ` · ${hiddenCount} hidden` : ''}${primary ? '' : ' · no cover set'}`}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {canUpload && (
                        <Button variant="outline" onClick={() => handleOpenAssocModal('upload')} className="h-9 px-3.5 text-[13px]">
                            <Upload size={14} strokeWidth={2.5} />
                            Upload
                        </Button>
                    )}
                    <Button onClick={() => handleOpenAssocModal('library')} className="h-9 px-3.5 text-[13px]">
                        <Plus size={14} strokeWidth={2.5} />
                        Add from library
                    </Button>
                </div>
            </div>

            {/* Cover image */}
            {total > 0 && (
                primary ? (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-900">
                        <div className="h-44 sm:h-52 w-full">
                            {heroSrc(primary) ? (
                                <img
                                    // keyed by media so a new cover always mounts a fresh <img> instead of
                                    // reusing one that may still hold the previous (or a failed) load
                                    key={primary.mediaId}
                                    src={heroSrc(primary)}
                                    alt={primary.altText || primary.fileName || 'Cover image'}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-10 w-10 text-slate-500" /></div>
                            )}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-12">
                            <div className="flex items-end justify-between gap-3">
                                <div className="min-w-0">
                                    <PrimaryBadge />
                                    <div className="mt-1.5 text-white font-semibold text-[14px] truncate">{labelOf(primary)}</div>
                                    <div className="text-white/70 text-[11.5px]">
                                        {copy.coverDescription}
                                    </div>
                                </div>
                                <div className="hidden sm:block text-white/70 text-[11.5px] text-right shrink-0">
                                    Hover any image below and press <Star size={11} className="inline -mt-0.5 fill-current text-amber-300" /> to change the cover.
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <div className="text-[12.5px]">
                            <span className="font-semibold">No cover image set.</span>{' '}
                            Hover an image and press the star to make it the cover shown on listings.
                        </div>
                    </div>
                )
            )}

            {/* Toolbar */}
            {total > 0 && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <SearchBar
                        className="flex-1"
                        inputClassName="h-9 text-[13px] rounded-lg bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800"
                        placeholder="Search by name or type…"
                        value={search}
                        onChange={setSearch}
                    />
                    <div className="flex items-center gap-2">
                        <label className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 dark:border-gray-800 dark:bg-gray-900">
                            <ArrowUpDown size={14} className="text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="bg-transparent text-[13px] font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                            >
                                <option value="order">Display order</option>
                                <option value="name">Name</option>
                                <option value="date">Newest</option>
                            </select>
                        </label>
                        <div className="flex h-9 items-center rounded-lg bg-slate-100 p-1 dark:bg-gray-800">
                            {([['grid', Grid], ['list', List]] as const).map(([mode, Icon]) => (
                                <button
                                    key={mode}
                                    type="button"
                                    title={mode === 'grid' ? 'Grid view' : 'List view'}
                                    onClick={() => setViewMode(mode)}
                                    className={cn(
                                        "h-7 w-8 inline-flex items-center justify-center rounded-md transition-all",
                                        viewMode === mode
                                            ? "bg-white text-[var(--accent)] shadow-sm dark:bg-gray-900"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Icon size={15} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            {total === 0 && isFetching ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-gray-800 px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    <div className="mt-3 text-[13px] text-slate-500 dark:text-slate-400">Loading images…</div>
                </div>
            ) : total === 0 ? (
                <div
                    onDragOver={(e) => { if (canUpload) { e.preventDefault(); setIsDragging(true); } }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { if (!canUpload) return; handleDrop(e); setAddTab('upload'); setIsAssocModalOpen(true); }}
                    className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
                        isDragging
                            ? "border-[var(--accent)] bg-[var(--accent-light)]/40"
                            : "border-slate-200 bg-slate-50/60 dark:border-gray-800 dark:bg-gray-900/40"
                    )}
                >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 dark:bg-gray-900 dark:ring-gray-800">
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">Add photos to this {copy.ownerLabel}</div>
                    <div className="mt-1 max-w-sm text-[12.5px] text-slate-500 dark:text-slate-400">
                        {canUpload
                            ? 'Upload new files or pick images from the media library. The first one you add becomes the cover image.'
                            : 'Pick images from the media library. The first one you add becomes the cover image.'}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        {canUpload && (
                            <Button variant="outline" size="sm" onClick={() => handleOpenAssocModal('upload')}>
                                <Upload size={14} />
                                Upload files
                            </Button>
                        )}
                        <Button size="sm" onClick={() => handleOpenAssocModal('library')}>
                            <Library size={14} />
                            Choose from library
                        </Button>
                    </div>
                </div>
            ) : visibleMedia.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-[13px] text-slate-500 dark:border-gray-800">
                    No images match “{search}”.
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={visibleMedia.map(keyOf)}
                        strategy={viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
                    >
                        <div className={cn(
                            viewMode === 'grid'
                                ? "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
                                : "flex flex-col gap-2"
                        )}>
                            {visibleMedia.map(em => (
                                <SortableImageItem
                                    key={keyOf(em)}
                                    em={em}
                                    viewMode={viewMode}
                                    canDrag={canDrag}
                                    busy={busyMediaId === em.mediaId}
                                    onSetPrimary={handleSetPrimary}
                                    onToggleActive={handleToggleActive}
                                    onRemove={setPendingRemove}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {total > 1 && canDrag && (
                <p className="text-[11.5px] text-slate-400 dark:text-slate-500">
                    Drag images to change their display order. Sorting or searching turns reordering off.
                </p>
            )}

            {/* Remove confirmation */}
            <DeleteModal
                isOpen={!!pendingRemove}
                onClose={() => setPendingRemove(null)}
                onConfirm={handleConfirmRemove}
                title="Remove image"
                itemType="image"
                description={
                    pendingRemove?.isPrimary
                        ? `"${pendingRemove ? labelOf(pendingRemove) : ''}" is the current cover image. Removing it will leave this ${copy.ownerLabel} without a cover until you pick another. The file stays in the media library.`
                        : `Remove "${pendingRemove ? labelOf(pendingRemove) : ''}" from this ${copy.ownerLabel}? The file stays in the media library.`
                }
            />

            {/* Add images modal */}
            <Modal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                title="Add images"
                className="max-w-5xl w-[95vw]"
            >
                <div className="flex flex-col h-[70vh]">
                    {canUpload && (
                        <div className="mb-3 flex h-10 w-fit items-center rounded-lg bg-slate-100 p-1 dark:bg-gray-800">
                            {([['library', Library, 'From library'], ['upload', Upload, 'Upload new']] as const).map(([tab, Icon, label]) => (
                                <button
                                    key={tab}
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setAddTab(tab)}
                                    className={cn(
                                        "h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium transition-all disabled:opacity-60",
                                        addTab === tab
                                            ? "bg-white text-[var(--accent)] shadow-sm dark:bg-gray-900"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Icon size={14} />
                                    {label}
                                    {tab === 'upload' && pendingUploads.length > 0 && (
                                        <span className="ml-0.5 rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">{pendingUploads.length}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {addTab === 'upload' && canUpload ? (
                    <>
                    <div className="mb-3 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                            PNG, JPG or WebP · up to {MAX_UPLOAD_MB} MB each
                        </span>
                        <span className={cn("font-semibold", pendingUploads.length ? "text-[var(--accent)]" : "text-slate-400")}>
                            {pendingUploads.length} ready
                        </span>
                    </div>

                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "flex-1 overflow-y-auto rounded-xl border-2 border-dashed p-3 transition-colors",
                            isDragging
                                ? "border-[var(--accent)] bg-[var(--accent-light)]/40"
                                : "border-slate-200 bg-slate-50/60 dark:border-gray-800 dark:bg-gray-900/50"
                        )}
                    >
                        {pendingUploads.length === 0 ? (
                            <label className="flex h-full cursor-pointer flex-col items-center justify-center text-slate-400">
                                <Upload className="mb-3 h-12 w-12 text-slate-300" />
                                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">Drop files here or click to browse</p>
                                <p className="mt-1 text-[12.5px]">Each file is uploaded and attached to this {copy.ownerLabel}.</p>
                                <input type="file" accept="image/*" multiple className="hidden" disabled={isSubmitting} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                            </label>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {pendingUploads.map((pu, index) => (
                                    <div key={`${pu.file.name}-${pu.file.size}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-gray-800 dark:bg-gray-900">
                                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-gray-800">
                                            <img src={pu.preview} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate" title={pu.file.name}>{pu.file.name}</span>
                                                {!primary && index === 0 && <PrimaryBadge compact />}
                                            </div>
                                            <div className="mt-0.5 text-[11.5px] text-slate-400 dark:text-slate-500">
                                                {[pu.file.type.replace('image/', '').toUpperCase(), formatBytes(pu.file.size)].filter(Boolean).join(' · ')}
                                            </div>
                                            <input
                                                type="text"
                                                value={pu.altText}
                                                disabled={isSubmitting}
                                                onChange={(e) => setPendingAlt(index, e.target.value)}
                                                placeholder="Alt text (optional)"
                                                className="mt-1.5 w-full text-[12.5px] bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => removePending(index)}
                                            aria-label={`Remove ${pu.file.name}`}
                                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-500/10 disabled:opacity-50"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <label className={cn(
                                    "flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-[12.5px] text-slate-500 dark:border-gray-700",
                                    isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                )}>
                                    <Plus size={14} />
                                    Add more files
                                    <input type="file" accept="image/*" multiple className="hidden" disabled={isSubmitting} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                                </label>
                            </div>
                        )}
                    </div>

                    {uploadError && (
                        <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{uploadError}</p>
                    )}

                    <div className="mt-4 flex shrink-0 items-center justify-between border-t border-slate-200 pt-4 dark:border-gray-800">
                        <span className="text-[12.5px] text-slate-500 dark:text-slate-400">
                            {uploadProgress
                                ? `Uploading ${Math.min(uploadProgress.done + 1, uploadProgress.total)} of ${uploadProgress.total}…`
                                : !primary && pendingUploads.length > 0
                                    ? 'The first file will become the cover image.'
                                    : ''}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
                            <Button
                                onClick={handleUploadSubmit}
                                disabled={pendingUploads.length === 0 || isSubmitting}
                                isLoading={isSubmitting}
                                className="min-w-[150px]"
                            >
                                <Upload size={14} />
                                Upload {pendingUploads.length > 0 ? `${pendingUploads.length} ` : ''}image{pendingUploads.length === 1 ? '' : 's'}
                            </Button>
                        </div>
                    </div>
                    </>
                    ) : (
                    <>
                    <div className="mb-3 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                            {unassignedImages.length} available
                        </span>
                        <span className={cn("font-semibold", selectedImageIds.length ? "text-[var(--accent)]" : "text-slate-400")}>
                            {selectedImageIds.length} selected
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                        {unassignedImages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-slate-400">
                                <ImageIcon className="mb-3 h-12 w-12 text-slate-300" />
                                <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">Nothing left to add</p>
                                <p className="mt-1 text-[12.5px]">Every image in the library is already attached to this {copy.ownerLabel}.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
                                {unassignedImages.map((img: any) => {
                                    const isSelected = selectedImageIds.includes(img.id);
                                    const src = getMediaAssetUrl(img.thumbnailUrl || img.url);
                                    return (
                                        <button
                                            type="button"
                                            key={img.id}
                                            onClick={() => toggleImageSelection(img.id)}
                                            className={cn(
                                                "group relative aspect-square overflow-hidden rounded-lg border-2 bg-slate-200 text-left transition-all dark:bg-gray-800",
                                                isSelected
                                                    ? "border-[var(--accent)] ring-2 ring-[var(--accent-ring)] shadow-md"
                                                    : "border-transparent hover:border-[var(--accent)]/60 hover:shadow"
                                            )}
                                        >
                                            {src ? (
                                                <img src={src} alt={img.fileName || ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-6 w-6 text-slate-400" /></div>
                                            )}
                                            <div className={cn(
                                                "absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-5 text-[10.5px] text-white",
                                                "opacity-0 transition-opacity group-hover:opacity-100",
                                                isSelected && "opacity-100"
                                            )}>
                                                {img.fileName || `Image #${img.id}`}
                                            </div>
                                            {isSelected && (
                                                <div className="absolute right-1.5 top-1.5 rounded-full bg-[var(--accent)] p-0.5 text-white shadow">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex shrink-0 items-center justify-between border-t border-slate-200 pt-4 dark:border-gray-800">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={unassignedImages.length === 0}
                            onClick={() =>
                                setSelectedImageIds(
                                    selectedImageIds.length === unassignedImages.length ? [] : unassignedImages.map((img: any) => img.id)
                                )
                            }
                        >
                            {unassignedImages.length > 0 && selectedImageIds.length === unassignedImages.length ? 'Deselect all' : 'Select all'}
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedImageIds.length === 0 || isSubmitting}
                                isLoading={isSubmitting}
                                className="min-w-[150px]"
                            >
                                Add {selectedImageIds.length > 0 ? `${selectedImageIds.length} ` : ''}image{selectedImageIds.length === 1 ? '' : 's'}
                            </Button>
                        </div>
                    </div>
                    </>
                    )}
                </div>
            </Modal>
        </div>
    );
};
