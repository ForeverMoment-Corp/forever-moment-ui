import * as types from './action-types';
import {
    getSubCategories,
    createSubCategory as createSubCategoryApi,
    updateSubCategory as updateSubCategoryApi,
    deleteSubCategory as deleteSubCategoryApi,
    associateSubCategoryWithLocationApi,
    disassociateSubCategoryFromLocationApi,
    fetchSubCategoryLocationsApi
} from './api';

export const getSubCategoryData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_SUB_CATEGORY_DATA });
    try {
        const response = await getSubCategories();
        dispatch({
            type: types.GET_SUB_CATEGORY_DATA_SUCCESS,
            payload: response.data.response || response.data, // Fallback if no nested response
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_SUB_CATEGORY_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch sub categories',
        });
    }
};

export const createSubCategory = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_SUB_CATEGORY });
    try {
        const response = await createSubCategoryApi(data);
        dispatch({
            type: types.CREATE_SUB_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getSubCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_SUB_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to create sub category',
        });
        throw error;
    }
};

export const updateSubCategory = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_SUB_CATEGORY });
    try {
        const response = await updateSubCategoryApi(id, data);
        dispatch({
            type: types.UPDATE_SUB_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getSubCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_SUB_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to update sub category',
        });
        throw error;
    }
};

export const deleteSubCategory = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_SUB_CATEGORY });
    try {
        const response = await deleteSubCategoryApi(id);
        dispatch({
            type: types.DELETE_SUB_CATEGORY_SUCCESS,
            payload: id,
        });
        dispatch(getSubCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_SUB_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete sub category',
        });
        throw error;
    }
};

export const associateLocation = (locationId: number, subCategoryId: number, payload: any) => async (dispatch: any) => {
    dispatch({ type: types.ASSOCIATE_LOCATION });
    try {
        const response = await associateSubCategoryWithLocationApi(locationId, subCategoryId, payload);
        dispatch({
            type: types.ASSOCIATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getSubCategoryData());
        dispatch(getSubCategoryLocations(subCategoryId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.ASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to associate location',
        });
        throw error;
    }
};

export const disassociateLocation = (locationId: number, subCategoryId: number) => async (dispatch: any) => {
    dispatch({ type: types.DISASSOCIATE_LOCATION });
    try {
        const response = await disassociateSubCategoryFromLocationApi(locationId, subCategoryId);
        dispatch({
            type: types.DISASSOCIATE_LOCATION_SUCCESS,
            payload: { locationId, subCategoryId },
        });
        dispatch(getSubCategoryData());
        dispatch(getSubCategoryLocations(subCategoryId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DISASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to disassociate location',
        });
        throw error;
    }
};

export const getSubCategoryLocations = (subCategoryId: number) => async (dispatch: any) => {
    dispatch({ type: types.GET_SUB_CATEGORY_LOCATIONS });
    try {
        const response = await fetchSubCategoryLocationsApi(subCategoryId);
        dispatch({
            type: types.GET_SUB_CATEGORY_LOCATIONS_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_SUB_CATEGORY_LOCATIONS_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch sub category locations',
        });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});

