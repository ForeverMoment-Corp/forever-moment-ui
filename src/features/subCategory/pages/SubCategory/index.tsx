import { connect } from 'react-redux';
import { getCategoryData } from '@/features/category/store/actions';
import { getLocationData } from '@/features/location/store/actions';
import {
    getSubCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    associateLocation,
    disassociateLocation,
    getSubCategoryLocations,
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
    attachedLocations: state.subCategory ? (state.subCategory as any).attachedLocations : [],
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
    getSubCategoryLocations,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
