import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ImageIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SectionLabel } from '@/components/common/DetailsLayout';
import { MediaPicker } from './MediaPicker';
import type { PromotionAssetPayload, PromotionAssetType } from '@/features/promotionAssets/store/action-types';
import { heroSrc, toPayload } from '@/features/promotionAssets/store/utils';

interface PromotionAssetImageProps {
    asset: PromotionAssetType;
    availableImages: any[];
    imagesLoading?: boolean;
    getImages: () => void;
    updatePromotionAsset: (id: number, data: PromotionAssetPayload) => Promise<any>;
}

/**
 * Shows the media record this asset is bound to and lets the user swap it for another
 * library image. Swapping is a regular PUT with a new `mediaId`; nothing is uploaded here.
 */
export const PromotionAssetImage = ({ asset, availableImages, imagesLoading, getImages, updatePromotionAsset }: PromotionAssetImageProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [pending, setPending] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setShowPicker(false);
        setPending(null);
    }, [asset.id]);

    useEffect(() => {
        if (showPicker && (!availableImages || availableImages.length === 0)) getImages();
    }, [showPicker, availableImages, getImages]);

    const currentSrc = heroSrc(asset);

    const handleSwap = async () => {
        if (!pending) return;
        setIsSaving(true);
        try {
            await updatePromotionAsset(asset.id, toPayload(asset, { mediaId: Number(pending.id) }));
            setPending(null);
            setShowPicker(false);
        } catch (error) {
            console.error('Failed to change promotion asset image:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <SectionLabel>Bound image</SectionLabel>
            <div className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-xl p-3 mb-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-72 aspect-video shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
                        {currentSrc
                            ? <img src={currentSrc} alt={asset.altTextOverride || asset.title || asset.fileName || 'Promotion banner'} className="h-full w-full object-cover" />
                            : <ImageIcon size={24} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">{asset.fileName || `Media #${asset.mediaId}`}</p>
                            <dl className="text-[12px] text-slate-500 dark:text-slate-400 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                                <dt className="font-medium">Media ID</dt><dd>{asset.mediaId}</dd>
                                {asset.storageFileName && (<><dt className="font-medium">Storage name</dt><dd className="truncate">{asset.storageFileName}</dd></>)}
                            </dl>
                            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                                Served from the global media library. Replace the file itself under Images; swap the binding here.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setShowPicker((v) => !v)} disabled={isSaving}>
                                <RefreshCw size={14} />
                                {showPicker ? 'Cancel' : 'Change image'}
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link to="/admin/images">
                                    <ExternalLink size={14} />
                                    Open media library
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {showPicker && (
                <>
                    <SectionLabel>Pick a replacement</SectionLabel>
                    <MediaPicker
                        className="h-[320px]"
                        images={availableImages || []}
                        loading={imagesLoading}
                        selectedId={pending ? Number(pending.id) : asset.mediaId}
                        onSelect={(img) => setPending(String(img.id) === String(asset.mediaId) ? null : img)}
                    />
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-[12.5px] text-slate-500 dark:text-slate-400">
                            {pending ? <>Selected <strong className="text-slate-800 dark:text-slate-200">{pending.fileName || `Media #${pending.id}`}</strong></> : 'Select a different image to enable saving.'}
                        </span>
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" size="sm" onClick={() => { setPending(null); setShowPicker(false); }} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button type="button" size="sm" onClick={handleSwap} disabled={!pending} isLoading={isSaving}>
                                Use this image
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
