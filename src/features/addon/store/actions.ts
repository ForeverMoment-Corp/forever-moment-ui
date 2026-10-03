import * as types from './action-types';
import {
    getAddonDataApi,
    createAddonApi,
    updateAddonApi,
    deleteAddonApi,
    uploadAddonImageApi
} from './api';

export const getAddonData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_ADDON_DATA_REQUEST });
    try {
        const response = await getAddonDataApi();
        dispatch({
            type: types.GET_ADDON_DATA_SUCCESS,
            payload: response.data.response,
        });
    } catch (error: any) {
        dispatch({
            type: types.GET_ADDON_DATA_FAILURE,
            payload: error.response?.data?.message || 'Something went wrong',
        });
    }
};

export const createAddon = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.ADD_ADDON_REQUEST });
    try {
        const response = await createAddonApi(data);
        dispatch({
            type: types.ADD_ADDON_SUCCESS,
            payload: response.data,
        });
        dispatch(getAddonData());
        return response;
    } catch (error: any) {
        dispatch({
            type: types.ADD_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to create addon',
        });
        throw error;
    }
};

export const updateAddon = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_ADDON_REQUEST });
    try {
        const response = await updateAddonApi(id, data);
        dispatch({
            type: types.UPDATE_ADDON_SUCCESS,
            payload: response.data,
        });
        dispatch(getAddonData());
        return response;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to update addon',
        });
        throw error;
    }
};

export const deleteAddon = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_ADDON_REQUEST });
    try {
        await deleteAddonApi(id);
        dispatch({
            type: types.DELETE_ADDON_SUCCESS,
            payload: id,
        });
        dispatch(getAddonData());
    } catch (error: any) {
        dispatch({
            type: types.DELETE_ADDON_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete addon',
        });
        throw error;
    }
};

/** Upload an image file and attach it to the add-on; the list is refreshed so the new URLs show up. */
export const uploadAddonImage = (id: number, file: File, metadata: Record<string, any> = {}) => async (dispatch: any) => {
    dispatch({ type: types.UPLOAD_ADDON_IMAGE_REQUEST });
    try {
        const response = await uploadAddonImageApi(id, file, metadata);
        const payload = response.data?.response ?? response.data;
        dispatch({
            type: types.UPLOAD_ADDON_IMAGE_SUCCESS,
            payload,
        });
        dispatch(getAddonData());
        return payload;
    } catch (error: any) {
        dispatch({
            type: types.UPLOAD_ADDON_IMAGE_FAILURE,
            payload: error.response?.data?.message || 'Failed to upload addon image',
        });
        throw error;
    }
};

/**
 * Detach the add-on's image. There is no dedicated endpoint, so this is a regular update
 * with `mediaId: null` (the backend resolves the media from that field on every update).
 */
export const removeAddonImage = (addon: types.AddonType) => async (dispatch: any) => {
    dispatch({ type: types.REMOVE_ADDON_IMAGE_REQUEST });
    try {
        const response = await updateAddonApi(addon.id, {
            name: addon.name,
            description: addon.description,
            icon: addon.icon,
            basePrice: addon.basePrice,
            isActive: addon.isActive,
            mediaId: null,
        });
        const payload = response.data?.response ?? response.data;
        dispatch({
            type: types.REMOVE_ADDON_IMAGE_SUCCESS,
            payload,
        });
        dispatch(getAddonData());
        return payload;
    } catch (error: any) {
        dispatch({
            type: types.REMOVE_ADDON_IMAGE_FAILURE,
            payload: error.response?.data?.message || 'Failed to remove addon image',
        });
        throw error;
    }
};

export const resetStatus = () => (dispatch: any) => {
    dispatch({ type: types.RESET_ADDON_STATUS });
};
