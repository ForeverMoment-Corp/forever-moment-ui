import * as types from './action-types';
import {
    createCategoryApi, fetchCategoryData, deleteCategoryApi, updateCategoryApi,
    associateCategoryWithLocationApi, disassociateCategoryFromLocationApi,
    fetchCategoryMediaApi, attachCategoryMediaApi, updateCategoryMediaApi,
    detachCategoryMediaApi, toggleCategoryMediaActiveApi, uploadCategoryMediaApi
} from './api';

export const getCategoryData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_CATEGORY_DATA });
    }
    try {
        const response = await fetchCategoryData();
        dispatch({
            type: types.GET_CATEGORY_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_CATEGORY_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch categories',
        });
    }
};

export const getCategoryDataSuccess = (data: any) => ({
    type: types.GET_CATEGORY_DATA_SUCCESS,
    payload: data,
});

export const getCategoryDataFailure = (error: string) => ({
    type: types.GET_CATEGORY_DATA_FAILURE,
    payload: error,
});

export const createCategory = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_CATEGORY });
    try {
        const response = await createCategoryApi(data);
        dispatch({
            type: types.CREATE_CATEGORY_SUCCESS,
            payload: response.data,
        });
        // Optionally refresh list
        dispatch(getCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to create category',
        });
        throw error;
    }
};

export const deleteCategory = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_CATEGORY });
    try {
        const response = await deleteCategoryApi(id);
        dispatch({
            type: types.DELETE_CATEGORY_SUCCESS,
            payload: id,
        });
        dispatch(getCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete category',
        });
        throw error;
    }
};

export const updateCategory = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_CATEGORY });
    try {
        const response = await updateCategoryApi(id, data);
        dispatch({
            type: types.UPDATE_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getCategoryData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to update category',
        });
        throw error;
    }
};

export const reorderCategory = (data: { id: number; newPosition: number }) => async (dispatch: any) => {
    dispatch({ type: types.REORDER_CATEGORY });
    try {
        // Optimistically update or just wait for refresh
        const response = await import('./api').then(api => api.reorderCategoryApi(data));
        dispatch({
            type: types.REORDER_CATEGORY_SUCCESS,
            payload: response.data,
        });
        dispatch(getCategoryData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.REORDER_CATEGORY_FAILURE,
            payload: error.response?.data?.message || 'Failed to reorder category',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS
});

export const associateLocation = (locationId: number, categoryId: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.ASSOCIATE_LOCATION });
    try {
        const response = await associateCategoryWithLocationApi(locationId, categoryId, data);
        dispatch({
            type: types.ASSOCIATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        // Optionally refresh list
        dispatch(getCategoryData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.ASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to associate location',
        });
        throw error;
    }
};

export const disassociateLocation = (locationId: number, categoryId: number) => async (dispatch: any) => {
    dispatch({ type: types.DISASSOCIATE_LOCATION });
    try {
        const response = await disassociateCategoryFromLocationApi(locationId, categoryId);
        dispatch({
            type: types.DISASSOCIATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        // Optionally refresh list
        dispatch(getCategoryData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DISASSOCIATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to disassociate location',
        });
        throw error;
    }
};

// ── Category media ───────────────────────────────────────────────────────────

/**
 * Load the images attached to one category.
 * `meta.categoryId` lets the reducer scope the list and discard a response that
 * arrives after the user has already selected another category.
 */
export const getCategoryMedia = (categoryId: number) => async (dispatch: any) => {
    dispatch({ type: types.GET_CATEGORY_MEDIA, meta: { categoryId } });
    try {
        const response = await fetchCategoryMediaApi(categoryId);
        const items = response.data.response || response.data;
        dispatch({
            type: types.GET_CATEGORY_MEDIA_SUCCESS,
            payload: items,
            meta: { categoryId },
        });
        return items;
    } catch (error: any) {
        dispatch({
            type: types.GET_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch category images',
            meta: { categoryId },
        });
        throw error;
    }
};

/**
 * Attach images already in the media library to a category.
 * There is no bulk endpoint for categories, so the rows are attached one by one;
 * the first failure aborts and surfaces, leaving the earlier ones attached.
 */
export const attachCategoryMedia = (categoryId: number, data: { items: any[] }) => async (dispatch: any) => {
    dispatch({ type: types.ATTACH_CATEGORY_MEDIA });
    try {
        const attached = [];
        for (const item of data.items || []) {
            const { mediaId, ...attach } = item;
            const response = await attachCategoryMediaApi(categoryId, mediaId, attach);
            attached.push(response.data?.response ?? response.data);
        }
        dispatch({ type: types.ATTACH_CATEGORY_MEDIA_SUCCESS, payload: attached });
        return attached;
    } catch (error: any) {
        dispatch({
            type: types.ATTACH_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to attach images',
        });
        throw error;
    }
};

/** Detach one image from the category; the file itself stays in the media library. */
export const detachCategoryMedia = (categoryId: number, mediaId: number) => async (dispatch: any) => {
    dispatch({ type: types.DETACH_CATEGORY_MEDIA });
    try {
        const response = await detachCategoryMediaApi(categoryId, mediaId);
        dispatch({ type: types.DETACH_CATEGORY_MEDIA_SUCCESS, payload: mediaId });
        dispatch(getCategoryData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DETACH_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to remove image',
        });
        throw error;
    }
};

export const updateCategoryMediaAttachment = (categoryId: number, mediaId: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_CATEGORY_MEDIA });
    try {
        const response = await updateCategoryMediaApi(categoryId, mediaId, data);
        dispatch({ type: types.UPDATE_CATEGORY_MEDIA_SUCCESS, payload: response.data });
        await dispatch(getCategoryMedia(categoryId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to update image',
        });
        throw error;
    }
};

export const toggleCategoryMediaActive = (categoryId: number, mapperId: number) => async (dispatch: any) => {
    dispatch({ type: types.TOGGLE_CATEGORY_MEDIA_ACTIVE });
    try {
        const response = await toggleCategoryMediaActiveApi(categoryId, mapperId);
        dispatch({ type: types.TOGGLE_CATEGORY_MEDIA_ACTIVE_SUCCESS, payload: response.data });
        await dispatch(getCategoryMedia(categoryId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.TOGGLE_CATEGORY_MEDIA_ACTIVE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update image',
        });
        throw error;
    }
};

/**
 * Mark one attached image as the category's primary (cover) image.
 * The backend demotes the previous primary itself. A cover must be visible, so it
 * is also activated.
 */
export const setPrimaryCategoryMedia = (categoryId: number, mediaId: number, current?: any) => async (dispatch: any) => {
    dispatch({ type: types.SET_PRIMARY_CATEGORY_MEDIA });
    try {
        const response = await updateCategoryMediaApi(categoryId, mediaId, {
            isPrimary: true,
            isActive: true,
            displayOrder: current?.displayOrder ?? undefined,
            altText: current?.altText ?? undefined,
        });
        const payload = response.data?.response || response.data;
        dispatch({ type: types.SET_PRIMARY_CATEGORY_MEDIA_SUCCESS, payload });
        await dispatch(getCategoryMedia(categoryId));
        dispatch(getCategoryData(true));
        return payload;
    } catch (error: any) {
        dispatch({
            type: types.SET_PRIMARY_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to set cover image',
        });
        throw error;
    }
};

/**
 * Upload a new file and attach it to the category in one call.
 * Callers uploading several files should pass `refresh: false` for all but the last
 * one and refresh once at the end, to avoid a refetch per file.
 */
export const uploadCategoryMedia = (
    categoryId: number,
    file: File,
    attach: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean } = {},
    metadata: Record<string, any> = {},
    refresh: boolean = true
) => async (dispatch: any) => {
    dispatch({ type: types.UPLOAD_CATEGORY_MEDIA });
    try {
        const response = await uploadCategoryMediaApi(categoryId, file, attach, metadata);
        const payload = response.data?.response ?? response.data;
        dispatch({ type: types.UPLOAD_CATEGORY_MEDIA_SUCCESS, payload });
        if (refresh) {
            await dispatch(getCategoryMedia(categoryId));
            dispatch(getCategoryData(true));
        }
        return payload;
    } catch (error: any) {
        dispatch({
            type: types.UPLOAD_CATEGORY_MEDIA_FAILURE,
            payload: error.response?.data?.message || 'Failed to upload image',
        });
        throw error;
    }
};
