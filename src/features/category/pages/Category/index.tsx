import { connect } from 'react-redux';
import { getCategoryData, createCategory, deleteCategory, updateCategory, reorderCategory, associateLocation, disassociateLocation, resetStatus } from '@/features/category/store/actions';
import { getLocationData } from '@/features/location/store/actions';
import Category from './components/Category';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.category.data,
    loading: state.category.loading,
    error: state.category.error,
    status: state.category.status,
    locations: state.location?.data || [],
});

const mapDispatchToProps = {
    getCategoryData,
    createCategory,
    deleteCategory,
    updateCategory,
    reorderCategory,
    getLocationData,
    associateLocation,
    disassociateLocation,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
