import React from 'react';
import { MediaGalleryTab, type MediaAttachmentItem, type MediaGalleryCopy } from '@/components/common/MediaGalleryTab';

export type CategoryMediaItem = MediaAttachmentItem;

const COPY: MediaGalleryCopy = {
    ownerLabel: 'category',
    uploadCategory: 'categories',
    coverDescription: 'Shown as the main photo wherever this category appears.',
};

interface CategoryImagesProps {
    categoryId: number;
    categoryMedia: CategoryMediaItem[];
    getCategoryMedia: (categoryId: number) => Promise<any>;
    availableImages: any[];
    getImages: () => void;
    attachCategoryMedia: (categoryId: number, data: { items: any[] }) => Promise<any>;
    detachCategoryMedia: (categoryId: number, mediaId: number) => Promise<any>;
    setPrimaryCategoryMedia?: (categoryId: number, mediaId: number, current?: CategoryMediaItem) => Promise<any>;
    updateCategoryMediaAttachment?: (categoryId: number, mediaId: number, data: any) => Promise<any>;
    toggleCategoryMediaActive?: (categoryId: number, mapperId: number) => Promise<any>;
    uploadCategoryMedia?: (
        categoryId: number,
        file: File,
        attach?: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean },
        metadata?: Record<string, any>,
        refresh?: boolean
    ) => Promise<any>;
}

/**
 * Images tab for a category — the shared gallery wired to the
 * /admin/categories/{id}/media endpoints.
 */
export const CategoryImages: React.FC<CategoryImagesProps> = ({
    categoryId,
    categoryMedia,
    getCategoryMedia,
    availableImages,
    getImages,
    attachCategoryMedia,
    detachCategoryMedia,
    setPrimaryCategoryMedia,
    updateCategoryMediaAttachment,
    toggleCategoryMediaActive,
    uploadCategoryMedia,
}) => (
    <MediaGalleryTab
        ownerId={categoryId}
        copy={COPY}
        media={categoryMedia}
        getMedia={getCategoryMedia}
        availableImages={availableImages}
        getImages={getImages}
        attachMedia={attachCategoryMedia}
        detachMedia={detachCategoryMedia}
        setPrimaryMedia={setPrimaryCategoryMedia}
        updateMediaAttachment={updateCategoryMediaAttachment}
        toggleMediaActive={toggleCategoryMediaActive}
        uploadMedia={uploadCategoryMedia}
    />
);
