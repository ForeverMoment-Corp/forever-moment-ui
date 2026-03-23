import { connect } from 'react-redux';
import {
    getLocationData,
    createLocation,
    deleteLocation,
    updateLocation,
    reorderLocation,
    resetStatus,
    getLocationSubCategories,
    getLocationCategories
} from '@/features/location/store/actions';
import { getSubCategoryData, associateLocation, disassociateLocation } from '@/features/subCategory/store/actions';
import { getCategoryData, associateLocation as associateCategoryLocation, disassociateLocation as disassociateCategoryLocation } from '@/features/category/store/actions';
import Location from './components/Location';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.location.data,
    loading: state.location.loading,
    error: state.location.error,
    status: state.location.status,
    allSubCategories: state.subCategory ? state.subCategory.data : [],
    locationSubCategories: state.location.subCategories || [],
    subCategoryStatus: state.subCategory ? (state.subCategory as any).status : 'IDLE',
    allCategories: state.category ? state.category.data : [],
    locationCategories: state.location.categories || [],
    categoryStatus: state.category ? state.category.status : 'IDLE',
});

const mapDispatchToProps = {
    getLocationData,
    createLocation,
    deleteLocation,
    updateLocation,
    reorderLocation,
    resetStatus,
    getSubCategoryData,
    getLocationSubCategories,
    associateLocation,
    disassociateLocation,
    getCategoryData,
    getLocationCategories,
    associateCategory: associateCategoryLocation,
    disassociateCategory: disassociateCategoryLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);
