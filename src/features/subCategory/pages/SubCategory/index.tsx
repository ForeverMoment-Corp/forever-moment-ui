import { connect } from 'react-redux';
import { getCategoryData } from '@/features/category/store/actions';
import { getLocationData, getSubCategoryLocationLinks } from '@/features/location/store/actions';
import { getImages } from '@/features/images/store/actions';
import {
    getSubCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    associateLocation,
    disassociateLocation,
    getSubCategoryMedia,
    attachSubCategoryMedia,
    detachSubCategoryMedia,
    updateSubCategoryMediaAttachment,
    toggleSubCategoryMediaActive,
    setPrimarySubCategoryMedia,
    uploadSubCategoryMedia,
    resetStatus
} from '@/features/subCategory/store/actions';
import SubCategory from './components/SubCategory';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.subCategory ? state.subCategory.data : null,
    loading: state.subCategory ? state.subCategory.loading : false,
    error: state.subCategory ? state.subCategory.error : null,
    status: state.subCategory ? (state.subCategory as any).status : 'IDLE',
    categories: state.category?.data || [],
    locations: state.location?.data || [],
    subCategoryLocationLinks: state.location?.subCategoryLocationLinks || [],
    loadingSubCategoryLinks: state.location?.loadingSubCategoryLinks || false,
    images: state.image?.data || [],
    subCategoryMedia: state.subCategory ? (state.subCategory as any).subCategoryMedia || [] : [],
});

const mapDispatchToProps = {
    getSubCategoryData,
    getCategoryData,
    getLocationData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    associateLocation,
    disassociateLocation,
    getSubCategoryLocationLinks,
    getImages,
    getSubCategoryMedia,
    attachSubCategoryMedia,
    detachSubCategoryMedia,
    updateSubCategoryMediaAttachment,
    toggleSubCategoryMediaActive,
    setPrimarySubCategoryMedia,
    uploadSubCategoryMedia,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
