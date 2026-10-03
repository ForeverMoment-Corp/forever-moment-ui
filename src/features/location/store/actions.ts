import * as types from './action-types';
import {
    fetchLocationData, createLocationApi, deleteLocationApi, updateLocationApi, reorderLocationApi,
    fetchPincodeData, createPincodeApi, deletePincodeApi, updatePincodeApi,
    fetchLocationSubCategoriesApi, fetchLocationCategoriesApi
} from './api';

export const getLocationData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_LOCATION_DATA });
    }
    try {
        const response = await fetchLocationData();
        dispatch({
            type: types.GET_LOCATION_DATA_SUCCESS,
            payload: response.data.response,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_LOCATION_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch locations',
        });
    }
};

export const createLocation = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_LOCATION });
    try {
        const response = await createLocationApi(data);
        dispatch({
            type: types.CREATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getLocationData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to create location',
        });
        throw error;
    }
};

export const deleteLocation = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_LOCATION });
    try {
        const response = await deleteLocationApi(id);
        dispatch({
            type: types.DELETE_LOCATION_SUCCESS,
            payload: id,
        });
        dispatch(getLocationData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete location',
        });
        throw error;
    }
};

export const updateLocation = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_LOCATION });
    try {
        const response = await updateLocationApi(id, data);
        dispatch({
            type: types.UPDATE_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getLocationData());
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to update location',
        });
        throw error;
    }
};

export const reorderLocation = (data: { id: number; newPosition: number }) => async (dispatch: any) => {
    dispatch({ type: types.REORDER_LOCATION });
    try {
        const response = await reorderLocationApi(data);
        dispatch({
            type: types.REORDER_LOCATION_SUCCESS,
            payload: response.data,
        });
        dispatch(getLocationData(true));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.REORDER_LOCATION_FAILURE,
            payload: error.response?.data?.message || 'Failed to reorder location',
        });
        throw error;
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});

export const getPincodeData = (locationId: number, isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_PINCODE_DATA });
    }
    try {
        const response = await fetchPincodeData(locationId);
        dispatch({
            type: types.GET_PINCODE_DATA_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_PINCODE_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch pincodes',
        });
    }
};

export const createPincode = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_PINCODE });
    try {
        const response = await createPincodeApi(data);
        dispatch({
            type: types.CREATE_PINCODE_SUCCESS,
            payload: response.data,
        });
        dispatch(getPincodeData(data.locationId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_PINCODE_FAILURE,
            payload: error.response?.data?.message || 'Failed to create pincode',
        });
        throw error;
    }
};

export const deletePincode = (id: number, locationId: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_PINCODE });
    try {
        const response = await deletePincodeApi(id);
        dispatch({
            type: types.DELETE_PINCODE_SUCCESS,
            payload: id,
        });
        dispatch(getPincodeData(locationId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.DELETE_PINCODE_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete pincode',
        });
        throw error;
    }
};

export const updatePincode = (id: number, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_PINCODE });
    try {
        const response = await updatePincodeApi(id, data);
        dispatch({
            type: types.UPDATE_PINCODE_SUCCESS,
            payload: response.data,
        });
        dispatch(getPincodeData(data.locationId));
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_PINCODE_FAILURE,
            payload: error.response?.data?.message || 'Failed to update pincode',
        });
        throw error;
    }
};

export const getLocationSubCategories = (locationId: number) => async (dispatch: any) => {
    dispatch({ type: types.GET_LOCATION_SUB_CATEGORIES });
    try {
        const response = await fetchLocationSubCategoriesApi(locationId);
        dispatch({
            type: types.GET_LOCATION_SUB_CATEGORIES_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_LOCATION_SUB_CATEGORIES_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch location sub categories',
        });
    }
};

export const getLocationCategories = (locationId: number) => async (dispatch: any) => {
    dispatch({ type: types.GET_LOCATION_CATEGORIES });
    try {
        const response = await fetchLocationCategoriesApi(locationId);
        dispatch({
            type: types.GET_LOCATION_CATEGORIES_SUCCESS,
            payload: response.data.response || response.data,
        });
        return response.data;
    } catch (error: any) {
        dispatch({
            type: types.GET_LOCATION_CATEGORIES_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch location categories',
        });
    }
};

// ── Category / sub-category association index ────────────────────────────────
// The backend only answers this relation from the location side
// (GET /admin/locations/{id}/categories and .../subcategories); there is no
// "locations for category X" endpoint. So the index is built by asking every
// location once and flattening the junction rows. The result is cached in the
// store and shared by every category, so it is built once per page visit rather
// than once per selected category.

/** Highest number of location requests kept in flight while building an index. */
const LINK_FETCH_CONCURRENCY = 6;

/** Runs `task` over `items`, never exceeding `limit` concurrent calls. */
const mapWithConcurrency = async <T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> => {
    const results: R[] = new Array(items.length);
    let cursor = 0;

    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (cursor < items.length) {
            const index = cursor++;
            results[index] = await task(items[index]);
        }
    });

    // allSettled (rather than all) so a late rejection from a sibling worker is not
    // left unhandled; the first failure is then rethrown.
    const settled = await Promise.allSettled(workers);
    const failed = settled.find((outcome) => outcome.status === 'rejected');
    if (failed) throw (failed as PromiseRejectedResult).reason;

    return results;
};

/** Locations already in the store, or a fresh fetch when the page has not loaded them yet. */
const resolveLocations = async (getState: any) => {
    const cached = getState()?.location?.data;
    if (Array.isArray(cached) && cached.length > 0) return cached;
    const response = await fetchLocationData();
    const rows = response.data?.response || response.data || [];
    return Array.isArray(rows) ? rows : [];
};

/**
 * Builds the flat list of category ↔ location junction rows across all locations.
 *
 * A single location's failure aborts the whole build on purpose: a partial index
 * would show an attached location as unattached, and toggling that row would send
 * an attach for a link that already exists.
 */
export const getCategoryLocationLinks = () => async (dispatch: any, getState: any) => {
    dispatch({ type: types.GET_CATEGORY_LOCATION_LINKS });
    try {
        const locations = await resolveLocations(getState);
        const perLocation = await mapWithConcurrency(locations, LINK_FETCH_CONCURRENCY, async (location: any) => {
            const response = await fetchLocationCategoriesApi(location.id);
            const rows = response.data?.response || response.data || [];
            // The DTO carries locationId, but fall back to the location we asked about.
            return (Array.isArray(rows) ? rows : []).map((row: any) => ({
                ...row,
                locationId: row.locationId ?? location.id,
            }));
        });
        const links = perLocation.flat();
        dispatch({ type: types.GET_CATEGORY_LOCATION_LINKS_SUCCESS, payload: links });
        return links;
    } catch (error: any) {
        dispatch({
            type: types.GET_CATEGORY_LOCATION_LINKS_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch category locations',
        });
        throw error;
    }
};

/** Same as {@link getCategoryLocationLinks}, for sub-category ↔ location rows. */
export const getSubCategoryLocationLinks = () => async (dispatch: any, getState: any) => {
    dispatch({ type: types.GET_SUB_CATEGORY_LOCATION_LINKS });
    try {
        const locations = await resolveLocations(getState);
        const perLocation = await mapWithConcurrency(locations, LINK_FETCH_CONCURRENCY, async (location: any) => {
            const response = await fetchLocationSubCategoriesApi(location.id);
            const rows = response.data?.response || response.data || [];
            return (Array.isArray(rows) ? rows : []).map((row: any) => ({
                ...row,
                locationId: row.locationId ?? location.id,
            }));
        });
        const links = perLocation.flat();
        dispatch({ type: types.GET_SUB_CATEGORY_LOCATION_LINKS_SUCCESS, payload: links });
        return links;
    } catch (error: any) {
        dispatch({
            type: types.GET_SUB_CATEGORY_LOCATION_LINKS_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch sub-category locations',
        });
        throw error;
    }
};
