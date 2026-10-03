import { getImageUrl, getImageByStorageNameUrl, getImageSources } from '@/features/images/store/api';
import { SectionLabel } from '@/components/common/DetailsLayout';
import { ImagePreview } from './ImagePreview';
import { ImageMetadata } from './ImageMetadata';

interface ImageDetailsProps {
    image: any;
    metadata?: any;
    previewUrl?: string | null;
    onDownload?: (id: string, fileName?: string, sourceUrl?: string) => void;
}

export const ImageDetails = ({ image, metadata, previewUrl, onDownload }: ImageDetailsProps) => {
    if (!image) return null;

    const displayMetadata = metadata || image.metadata || {};
    const sources = getImageSources(image);

    // Prefer the direct media URL from the API; fall back to the blob preview or the admin endpoints.
    const legacyFallbackUrl = image.storageFileName
        ? getImageByStorageNameUrl(image.storageFileName)
        : getImageUrl(String(image.id));
    const fallbackUrl = sources.original || legacyFallbackUrl;
    const displayUrl = sources.preview || previewUrl || legacyFallbackUrl;

    const handleDownload = onDownload
        ? () => onDownload(image.id, image.fileName, image.originalUrl)
        : undefined;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Image Preview Section */}
            <div>
                <SectionLabel>Preview</SectionLabel>
                <div className="mt-3">
                    <ImagePreview
                        src={displayUrl}
                        fileName={image.fileName}
                        contentType={image.mimeType || image.contentType}
                        size={image.fileSizeBytes ?? image.size}
                        fallbackUrl={fallbackUrl}
                        onDownload={handleDownload}
                    />
                </div>
            </div>

            {/* Metadata Section */}
            <ImageMetadata
                image={image}
                displayMetadata={displayMetadata}
                onDownload={onDownload}
            />
        </div>
    );
};
