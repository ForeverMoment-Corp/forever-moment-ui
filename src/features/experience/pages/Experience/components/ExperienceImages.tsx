import React from 'react';
import { MediaGalleryTab, type MediaAttachmentItem, type MediaGalleryCopy } from '@/components/common/MediaGalleryTab';

/** Kept as the feature-local name for the shared media row shape. */
export type ExperienceMediaItem = MediaAttachmentItem;

const COPY: MediaGalleryCopy = {
    ownerLabel: 'experience',
    uploadCategory: 'experiences',
    coverDescription: 'Shown as the main photo on listings and the experience page.',
};

interface ExperienceImagesProps {
    experienceId: number;
    experienceMedia: ExperienceMediaItem[];
    getExperienceMedia: (experienceId: number) => Promise<any>;
    availableImages: any[];
    getImages: () => void;
    bulkAttachMedia: (experienceId: number, data: { items: any[] }) => Promise<any>;
    disassociateMedia: (experienceId: number, mediaId: number) => Promise<any>;
    setPrimaryMedia?: (experienceId: number, mediaId: number, current?: ExperienceMediaItem) => Promise<any>;
    updateMediaAttachment?: (experienceId: number, mediaId: number, data: any) => Promise<any>;
    toggleMediaActive?: (experienceId: number, mapperId: number) => Promise<any>;
    /** Direct upload: POST /admin/experiences/{id}/media/upload (multipart `file` + JSON `attach`). */
    uploadExperienceMedia?: (
        experienceId: number,
        file: File,
        attach?: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean },
        metadata?: Record<string, any>,
        refresh?: boolean
    ) => Promise<any>;
}

/**
 * Images tab for an experience — the shared gallery wired to the
 * /admin/experiences/{id}/media endpoints.
 */
export const ExperienceImages: React.FC<ExperienceImagesProps> = ({
    experienceId,
    experienceMedia,
    getExperienceMedia,
    availableImages,
    getImages,
    bulkAttachMedia,
    disassociateMedia,
    setPrimaryMedia,
    updateMediaAttachment,
    toggleMediaActive,
    uploadExperienceMedia,
}) => (
    <MediaGalleryTab
        ownerId={experienceId}
        copy={COPY}
        media={experienceMedia}
        getMedia={getExperienceMedia}
        availableImages={availableImages}
        getImages={getImages}
        attachMedia={bulkAttachMedia}
        detachMedia={disassociateMedia}
        setPrimaryMedia={setPrimaryMedia}
        updateMediaAttachment={updateMediaAttachment}
        toggleMediaActive={toggleMediaActive}
        uploadMedia={uploadExperienceMedia}
    />
);
