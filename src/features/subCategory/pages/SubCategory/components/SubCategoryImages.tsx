import React from 'react';
import { MediaGalleryTab, type MediaAttachmentItem, type MediaGalleryCopy } from '@/components/common/MediaGalleryTab';

export type SubCategoryMediaItem = MediaAttachmentItem;

const COPY: MediaGalleryCopy = {
    ownerLabel: 'sub-category',
    uploadCategory: 'subcategories',
    coverDescription: 'Shown as the main photo wherever this sub-category appears.',
};

interface SubCategoryImagesProps {
    subCategoryId: number;
    subCategoryMedia: SubCategoryMediaItem[];
    getSubCategoryMedia: (subCategoryId: number) => Promise<any>;
    availableImages: any[];
    getImages: () => void;
    attachSubCategoryMedia: (subCategoryId: number, data: { items: any[] }) => Promise<any>;
    detachSubCategoryMedia: (subCategoryId: number, mediaId: number) => Promise<any>;
    setPrimarySubCategoryMedia?: (subCategoryId: number, mediaId: number, current?: SubCategoryMediaItem) => Promise<any>;
    updateSubCategoryMediaAttachment?: (subCategoryId: number, mediaId: number, data: any) => Promise<any>;
    toggleSubCategoryMediaActive?: (subCategoryId: number, mapperId: number) => Promise<any>;
    uploadSubCategoryMedia?: (
        subCategoryId: number,
        file: File,
        attach?: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean },
        metadata?: Record<string, any>,
        refresh?: boolean
    ) => Promise<any>;
}

/**
 * Images tab for a sub-category — the shared gallery wired to the
 * /admin/subcategories/{id}/media endpoints.
 */
export const SubCategoryImages: React.FC<SubCategoryImagesProps> = ({
    subCategoryId,
    subCategoryMedia,
    getSubCategoryMedia,
    availableImages,
    getImages,
    attachSubCategoryMedia,
    detachSubCategoryMedia,
    setPrimarySubCategoryMedia,
    updateSubCategoryMediaAttachment,
    toggleSubCategoryMediaActive,
    uploadSubCategoryMedia,
}) => (
    <MediaGalleryTab
        ownerId={subCategoryId}
        copy={COPY}
        media={subCategoryMedia}
        getMedia={getSubCategoryMedia}
        availableImages={availableImages}
        getImages={getImages}
        attachMedia={attachSubCategoryMedia}
        detachMedia={detachSubCategoryMedia}
        setPrimaryMedia={setPrimarySubCategoryMedia}
        updateMediaAttachment={updateSubCategoryMediaAttachment}
        toggleMediaActive={toggleSubCategoryMediaActive}
        uploadMedia={uploadSubCategoryMedia}
    />
);
