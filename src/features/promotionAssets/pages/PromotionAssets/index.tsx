import { connect } from 'react-redux';
import {
    getPromotionAssets,
    createPromotionAsset,
    updatePromotionAsset,
    deletePromotionAsset,
    resetStatus,
} from '@/features/promotionAssets/store/actions';
import { getImages } from '@/features/images/store/actions';
import PromotionAssets from './components/PromotionAssets';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.promotionAssets.data,
    loading: state.promotionAssets.loading,
    error: state.promotionAssets.error,
    status: state.promotionAssets.status,
    // Media library, used by the image picker when binding an asset to a media record.
    availableImages: (state.image as any).data,
    imagesLoading: (state.image as any).loading,
});

const mapDispatchToProps = {
    getPromotionAssets,
    createPromotionAsset,
    updatePromotionAsset,
    deletePromotionAsset,
    getImages,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionAssets);
