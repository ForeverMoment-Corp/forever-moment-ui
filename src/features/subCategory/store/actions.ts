import * as types from './action-types';
import {
    getSubCategories,
    createSubCategory as createSubCategoryApi,
    updateSubCategory as updateSubCategoryApi,
    deleteSubCategory as deleteSubCategoryApi,
    associateSubCategoryWithLocationApi,
    disassociateSubCategoryFromLocationApi,
    fetchSubCategoryMediaApi,
    attachSubCategoryMediaApi,
    updateSubCategoryMediaApi,
    detachSubCategoryMediaApi,
    toggleSubCategoryMediaActiveApi,
    uploadSubCategoryMediaApi
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
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DISASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to disassociate location',
        });
        throw error;
    }
};


export const resetStatus = () => ({
    type: types.RESET_STATUS
});


// ── Sub-category media ───────────────────────────────────────────────────────

/**
 * Load the images attached to one sub-category.
 * `meta.subCategoryId` lets the reducer scope the list and discard a response that
 * arrives after the user has already selected another sub-category.
 */
export const getSubCategoryMedia = (subCategoryId: number) => async (dispatch: any) => {
    dispatch({ type: types.GET_SUB_CATEGORY_MEDIA, meta: { subCategoryId } });
    try {
        const response = await fetchSubCategoryMediaApi(subCategoryId);
        const items = response.data.response || response.data;
        dispatch({
            type: types.GET_SUB_CATEGORY_MEDIA_SUCCESS,
            payload: items,
            meta: { subCategoryId },
        });
        return items;
    } catch (error: any) {
        dispatch({
            type: types.GET_SUB_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch sub-category images',
            meta: { subCategoryId },
        });
        throw error;
    }
};

/**
 * Attach images already in the media library to a sub-category.
 * There is no bulk endpoint for sub-categories, so the rows are attached one by one;
 * the first failure aborts and surfaces, leaving the earlier ones attached.
 */
export const attachSubCategoryMedia = (subCategoryId: number, data: { items: any[] }) => async (dispatch: any) => {
    dispatch({ type: types.ATTACH_SUB_CATEGORY_MEDIA });
    try {
        const attached = [];
        for (const item of data.items || []) {
            const { mediaId, ...attach } = item;
            const response = await attachSubCategoryMediaApi(subCategoryId, mediaId, attach);
            attached.push(response.data?.response ?? response.data);
        }
        dispatch({ type: types.ATTACH_SUB_CATEGORY_MEDIA_SUCCESS, payload: attached });
        return attached;
    } catch (error: any) {
        dispatch({
            type: types.ATTACH_SUB_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to attach images',
        });
        throw error;
    }
};

/** Detach one image from the sub-category; the file itself stays in the media library. */
export const detachSubCategoryMedia = (subCategoryId: number, mediaId: number) => async (dispatch: any) => {
    dispatch({ type: types.DETACH_SUB_CATEGORY_MEDIA });
    try {
        const response = await detachSubCategoryMediaApi(subCategoryId, mediaId);
        dispatch({ type: types.DETACH_SUB_CATEGORY_MEDIA_SUCCESS, payload: mediaId });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DETACH_SUB_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to remove image',
        });
        throw error;
    }
};

export const updateSubCategoryMediaAttachment = (subCategoryId: number, mediaId: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_SUB_CATEGORY_MEDIA });
    try {
        const response = await updateSubCategoryMediaApi(subCategoryId, mediaId, data);
        dispatch({ type: types.UPDATE_SUB_CATEGORY_MEDIA_SUCCESS, payload: response.data });
        await dispatch(getSubCategoryMedia(subCategoryId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_SUB_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to update image',
        });
        throw error;
    }
};

export const toggleSubCategoryMediaActive = (subCategoryId: number, mapperId: number) => async (dispatch: any) => {
    dispatch({ type: types.TOGGLE_SUB_CATEGORY_MEDIA_ACTIVE });
    try {
        const response = await toggleSubCategoryMediaActiveApi(subCategoryId, mapperId);
        dispatch({ type: types.TOGGLE_SUB_CATEGORY_MEDIA_ACTIVE_SUCCESS, payload: response.data });
        await dispatch(getSubCategoryMedia(subCategoryId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.TOGGLE_SUB_CATEGORY_MEDIA_ACTIVE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update image',
        });
        throw error;
    }
};

/**
 * Mark one attached image as the sub-category's primary (cover) image.
 * The backend demotes the previous primary itself. A cover must be visible, so it
 * is also activated.
 */
export const setPrimarySubCategoryMedia = (subCategoryId: number, mediaId: number, current?: any) => async (dispatch: any) => {
    dispatch({ type: types.SET_PRIMARY_SUB_CATEGORY_MEDIA });
    try {
        const response = await updateSubCategoryMediaApi(subCategoryId, mediaId, {
            isPrimary: true,
            isActive: true,
            displayOrder: current?.displayOrder ?? undefined,
            altText: current?.altText ?? undefined,
        });
        const payload = response.data?.response || response.data;
        dispatch({ type: types.SET_PRIMARY_SUB_CATEGORY_MEDIA_SUCCESS, payload });
        await dispatch(getSubCategoryMedia(subCategoryId));
        return payload;
    } catch (error: any) {
        dispatch({
            type: types.SET_PRIMARY_SUB_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to set cover image',
        });
        throw error;
    }
};

/**
 * Upload a new file and attach it to the sub-category in one call.
 * Callers uploading several files should pass `refresh: false` for all but the last
 * one and refresh once at the end, to avoid a refetch per file.
 */
export const uploadSubCategoryMedia = (
    subCategoryId: number,
    file: File,
    attach: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean } = {},
    metadata: Record<string, any> = {},
    refresh: boolean = true
) => async (dispatch: any) => {
    dispatch({ type: types.UPLOAD_SUB_CATEGORY_MEDIA });
    try {
        const response = await uploadSubCategoryMediaApi(subCategoryId, file, attach, metadata);
        const payload = response.data?.response ?? response.data;
        dispatch({ type: types.UPLOAD_SUB_CATEGORY_MEDIA_SUCCESS, payload });
        if (refresh) {
            await dispatch(getSubCategoryMedia(subCategoryId));
        }
        return payload;
    } catch (error: any) {
        dispatch({
            type: types.UPLOAD_SUB_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to upload image',
        });
        throw error;
    }
};
