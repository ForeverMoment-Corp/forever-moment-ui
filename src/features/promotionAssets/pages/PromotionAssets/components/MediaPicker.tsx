import { useMemo, useState } from 'react';
import { CheckCircle2, ImageIcon, Search } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import { cn } from '@/utils/cn';

interface MediaPickerProps {
    images: any[];
    loading?: boolean;
    selectedId: number | null;
    onSelect: (image: any) => void;
    className?: string;
}

/**
 * Single-select grid over the global media library (GET /admin/images). Promotion assets
 * bind to an existing media record by id, so the picker never uploads anything itself.
 */
export const MediaPicker = ({ images, loading, selectedId, onSelect, className }: MediaPickerProps) => {
    const [search, setSearch] = useState('');

    const activeImages = useMemo(
        () => (images || []).filter((img: any) => img.isActive !== false),
        [images]
    );

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return activeImages;
        return activeImages.filter((img: any) =>
            [img.fileName, img.altText, img.storageFileName, String(img.id)]
                .filter(Boolean)
                .some((v: string) => v.toLowerCase().includes(s))
        );
    }, [activeImages, search]);

    return (
        <div className={cn('flex flex-col min-h-0', className)}>
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search library by file name or alt text…"
                        className="w-full text-[13px] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg pl-4 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-[var(--accent-ring)] focus:border-[var(--accent)] text-slate-900 dark:text-white"
                    />
                </div>
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {filtered.length} of {activeImages.length}
                </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                {loading && activeImages.length === 0 ? (
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg bg-slate-200 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="mb-3 h-10 w-10 text-slate-300" />
                        <p className="text-[14px] font-medium text-slate-600 dark:text-slate-300">
                            {activeImages.length === 0 ? 'The media library is empty' : 'No images match your search'}
                        </p>
                        <p className="mt-1 text-[12px]">
                            {activeImages.length === 0 ? 'Upload images under Operations → Images first.' : 'Try a different file name.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
                        {filtered.map((img: any) => {
                            const isSelected = selectedId != null && String(selectedId) === String(img.id);
                            const src = getMediaAssetUrl(img.thumbnailUrl || img.mediaUrl || img.url);
                            return (
                                <button
                                    type="button"
                                    key={img.id}
                                    onClick={() => onSelect(img)}
                                    className={cn(
                                        'group relative aspect-square overflow-hidden rounded-lg border-2 bg-slate-200 text-left transition-all dark:bg-gray-800',
                                        isSelected
                                            ? 'border-[var(--accent)] ring-2 ring-[var(--accent-ring)] shadow-md'
                                            : 'border-transparent hover:border-[var(--accent)]/60 hover:shadow'
                                    )}
                                >
                                    {src ? (
                                        <img src={src} alt={img.altText || img.fileName || ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-6 w-6 text-slate-400" /></div>
                                    )}
                                    <div className={cn(
                                        'absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-3 text-[10.5px] text-white',
                                        'opacity-0 transition-opacity group-hover:opacity-100',
                                        isSelected && 'opacity-100'
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
        </div>
    );
};
