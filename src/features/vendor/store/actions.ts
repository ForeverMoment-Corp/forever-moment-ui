import * as types from './action-types';
import { fetchVendorsApi, createVendorApi, updateVendorApi, deleteVendorApi } from './api';

/**
 * Maps a raw vendor record from the API to the UI model.
 * API uses: businessName, contactName, contactEmail, contactPhone, status (UPPERCASE)
 * UI uses:  name, contactPerson, email, phone, status (Title-case)
 */
const normalizeVendor = (v: any) => ({
    id: v.id,
    name: v.businessName ?? v.name ?? '',
    contactPerson: v.contactName ?? v.contactPerson ?? '',
    email: v.contactEmail ?? v.email ?? '',
    phone: v.contactPhone ?? v.phone ?? '',
    category: v.category ?? '',
    status: v.status
        ? (v.status.charAt(0).toUpperCase() + v.status.slice(1).toLowerCase()) as 'Active' | 'Inactive' | 'Pending'
        : 'Active',
    rating: v.rating,
});

export const getVendors = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_VENDORS });
    }
    try {
        const response = await fetchVendorsApi();
        const raw = response.data.response;
        const normalized = Array.isArray(raw) ? raw.map(normalizeVendor) : raw;
        dispatch({
            type: types.GET_VENDORS_SUCCESS,
            payload: normalized,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_VENDORS_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch vendors',
        });
    }
};

export const createVendor = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_VENDOR });
    try {
        const response = await createVendorApi(data);
        dispatch({
            type: types.CREATE_VENDOR_SUCCESS,
            payload: response.data,
        });
        dispatch(getVendors());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_VENDOR_FAILURE,
            payload: error.response?.data?.message || 'Failed to create vendor',
        });
        throw error;
    }
};

export const updateVendor = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_VENDOR });
    try {
        const response = await updateVendorApi(id, data);
        dispatch({
            type: types.UPDATE_VENDOR_SUCCESS,
            payload: response.data,
        });
        dispatch(getVendors());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_VENDOR_FAILURE,
            payload: error.response?.data?.message || 'Failed to update vendor',
        });
        throw error;
    }
};

export const deleteVendor = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_VENDOR });
    try {
        const response = await deleteVendorApi(id);
        dispatch({
            type: types.DELETE_VENDOR_SUCCESS,
            payload: id,
        });
        dispatch(getVendors());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_VENDOR_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete vendor',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
