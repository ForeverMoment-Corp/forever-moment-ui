import { connect } from 'react-redux';
import { getImages, uploadImage, deleteImage, downloadImage, getImageMetadata, resetStatus, fetchImageByStorageName } from '@/features/images/store/actions';

import Images from './components/Images';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.image.data,
    currentMetadata: state.image.currentMetadata,
    currentPreviewUrl: state.image.currentPreviewUrl,
    fetchedImageUrl: state.image.fetchedImageUrl,
    loading: state.image.loading,
    error: state.image.error,
    status: state.image.status,
});

const mapDispatchToProps = {
    getImages,
    uploadImage,
    deleteImage,
    downloadImage,
    getImageMetadata,
    fetchImageByStorageName,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Images);
