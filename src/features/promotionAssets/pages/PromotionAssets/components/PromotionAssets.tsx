import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { DeleteModal } from '@/components/common/DeleteModal';
import * as types from '@/features/promotionAssets/store/action-types';
import type { PromotionAssetFilters, PromotionAssetPayload, PromotionAssetType } from '@/features/promotionAssets/store/action-types';
import { PromotionAssetForm } from './PromotionAssetForm';
import { PromotionAssetSplitView } from './PromotionAssetSplitView';
import '../../css/styles.scss';

interface PromotionAssetsProps {
    data: PromotionAssetType[] | null;
    loading: boolean;
    error: string | null;
    status: string;
    availableImages: any[] | null;
    imagesLoading: boolean;
    getPromotionAssets: (filters?: PromotionAssetFilters) => void;
    createPromotionAsset: (data: PromotionAssetPayload) => Promise<any>;
    updatePromotionAsset: (id: number, data: PromotionAssetPayload) => Promise<any>;
    deletePromotionAsset: (id: number) => Promise<any>;
    getImages: () => void;
    resetStatus: () => void;
}

const PromotionAssets = ({
    data,
    loading,
    error,
    status,
    availableImages,
    imagesLoading,
    getPromotionAssets,
    createPromotionAsset,
    updatePromotionAsset,
    deletePromotionAsset,
    getImages,
    resetStatus,
}: PromotionAssetsProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<PromotionAssetType | null>(null);

    useEffect(() => {
        getPromotionAssets();
    }, [getPromotionAssets]);

    const assets = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    // Derived from the list so the details panel always shows the freshest row after a refetch,
    // and drops the selection if the row was deleted.
    const selectedAsset = useMemo(
        () => (selectedId == null ? null : assets.find((a) => String(a.id) === String(selectedId)) ?? null),
        [assets, selectedId]
    );
    const setSelectedAsset = useCallback((asset: PromotionAssetType | null) => setSelectedId(asset ? asset.id : null), []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            resetStatus();
        }
        if (status === types.ADD_PROMOTION_ASSET_SUCCESS) {
            toast.success('Promotion asset created');
            resetStatus();
        }
        if (status === types.UPDATE_PROMOTION_ASSET_SUCCESS) {
            toast.success('Promotion asset updated');
            resetStatus();
        }
        if (status === types.DELETE_PROMOTION_ASSET_SUCCESS) {
            toast.success('Promotion asset deleted');
            resetStatus();
        }
    }, [error, status, resetStatus]);

    const placements = useMemo(
        () => Array.from(new Set(assets.map((a) => a.placement).filter(Boolean))).sort(),
        [assets]
    );

    const handleOpenModal = (asset?: PromotionAssetType) => {
        setEditingId(asset ? asset.id : null);
        // The picker needs the library; fetch lazily the first time the form opens.
        if (!availableImages || availableImages.length === 0) getImages();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    /** The actions throw on failure, so reaching the end means the save went through. */
    const handleSubmit = async (payload: PromotionAssetPayload) => {
        if (editingId) {
            await updatePromotionAsset(editingId, payload);
        } else {
            await createPromotionAsset(payload);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (asset: PromotionAssetType) => {
        setDeleteTarget(asset);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deletePromotionAsset(deleteTarget.id);
            if (selectedId === deleteTarget.id) setSelectedId(null);
            closeDeleteModal();
        } catch {
            // The failure toast is driven by the store's `error` field; keep the modal open.
        }
    };

    return (
        <div className="promotion-assets-page-container w-full h-full flex flex-col">
            <PromotionAssetSplitView
                assets={assets}
                loading={loading}
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                updatePromotionAsset={updatePromotionAsset}
                availableImages={availableImages || []}
                imagesLoading={imagesLoading}
                getImages={getImages}
            />

            <PromotionAssetForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={editingId ? assets.find((a) => a.id === editingId) : null}
                availableImages={availableImages || []}
                imagesLoading={imagesLoading}
                placements={placements}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Promotion Asset"
                description={deleteTarget
                    ? `"${deleteTarget.title || deleteTarget.promoKey}" will stop being served for placement "${deleteTarget.placement}". The image stays in the media library.`
                    : undefined}
                itemType="promotion asset"
            />
        </div>
    );
};

export default PromotionAssets;
