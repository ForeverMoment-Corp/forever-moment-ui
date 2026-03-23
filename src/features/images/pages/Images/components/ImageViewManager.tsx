import { ImageSplitView } from './ImageSplitView';

export const ImageViewManager = ({
    images,
    handleOpenUploadModal,
    handleDeleteClick,
    selectedImage,
    setSelectedImage,
    loading,
    getImageMetadata,
    downloadImage,
    fetchImageByStorageName,
    currentMetadata,
    currentPreviewUrl,
    fetchedImageUrl,
}: any) => {
    const handleSelectImage = (img: any) => {
        setSelectedImage(img);
        if (img) {
            if (img.storageFileName && fetchImageByStorageName) {
                fetchImageByStorageName(img.storageFileName);
            } else {
                downloadImage(img.id);
            }
        }
    };

    const activePreviewUrl = fetchedImageUrl || currentPreviewUrl;

    return (
        <ImageSplitView
            images={images}
            onUploadClick={handleOpenUploadModal}
            onDeleteClick={handleDeleteClick}
            selectedImage={selectedImage}
            onSelectImage={handleSelectImage}
            onDownloadClick={downloadImage}
            currentMetadata={currentMetadata}
            currentPreviewUrl={activePreviewUrl}
            loading={loading}
        />
    );
};

