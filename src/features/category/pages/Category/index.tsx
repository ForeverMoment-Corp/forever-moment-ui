import { connect } from 'react-redux';
import {
    getCategoryData,
    createCategory,
    deleteCategory,
    updateCategory,
    reorderCategory,
    associateLocation,
    disassociateLocation,
    getCategoryMedia,
    attachCategoryMedia,
    detachCategoryMedia,
    updateCategoryMediaAttachment,
    toggleCategoryMediaActive,
    setPrimaryCategoryMedia,
    uploadCategoryMedia,
    resetStatus,
} from '@/features/category/store/actions';
import { getLocationData, getCategoryLocationLinks } from '@/features/location/store/actions';
import { getImages } from '@/features/images/store/actions';
import Category from './components/Category';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.category.data,
    loading: state.category.loading,
    error: state.category.error,
    status: state.category.status,
    locations: state.location?.data || [],
    categoryLocationLinks: state.location?.categoryLocationLinks || [],
    loadingCategoryLinks: state.location?.loadingCategoryLinks || false,
    images: state.image?.data || [],
    categoryMedia: state.category.categoryMedia || [],
});

const mapDispatchToProps = {
    getCategoryData,
    createCategory,
    deleteCategory,
    updateCategory,
    reorderCategory,
    getLocationData,
    getCategoryLocationLinks,
    associateLocation,
    disassociateLocation,
    getImages,
    getCategoryMedia,
    attachCategoryMedia,
    detachCategoryMedia,
    updateCategoryMediaAttachment,
    toggleCategoryMediaActive,
    setPrimaryCategoryMedia,
    uploadCategoryMedia,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
