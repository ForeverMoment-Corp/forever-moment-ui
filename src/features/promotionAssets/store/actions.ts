import * as types from './action-types';
import type { PromotionAssetFilters, PromotionAssetPayload } from './action-types';
import {
    getPromotionAssetsApi,
    createPromotionAssetApi,
    updatePromotionAssetApi,
    deletePromotionAssetApi,
} from './api';

export const getPromotionAssets = (filters: PromotionAssetFilters = {}) => async (dispatch: any) => {
    dispatch({ type: types.GET_PROMOTION_ASSETS_REQUEST });
    try {
        const response = await getPromotionAssetsApi(filters);
        dispatch({
            type: types.GET_PROMOTION_ASSETS_SUCCESS,
            payload: response.data?.response ?? response.data ?? [],
        });
    } catch (error: any) {
        dispatch({
            type: types.GET_PROMOTION_ASSETS_FAILURE,
            payload: error.response?.data?.message || 'Failed to load promotion assets',
        });
    }
};

export const createPromotionAsset = (data: PromotionAssetPayload) => async (dispatch: any) => {
    dispatch({ type: types.ADD_PROMOTION_ASSET_REQUEST });
    try {
        const response = await createPromotionAssetApi(data);
        dispatch({
            type: types.ADD_PROMOTION_ASSET_SUCCESS,
            payload: response.data?.response ?? response.data,
        });
        dispatch(getPromotionAssets());
        return response;
    } catch (error: any) {
        dispatch({
            type: types.ADD_PROMOTION_ASSET_FAILURE,
            payload: error.response?.data?.message || 'Failed to create promotion asset',
        });
        throw error;
    }
};

export const updatePromotionAsset = (id: number, data: PromotionAssetPayload) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_PROMOTION_ASSET_REQUEST });
    try {
        const response = await updatePromotionAssetApi(id, data);
        dispatch({
            type: types.UPDATE_PROMOTION_ASSET_SUCCESS,
            payload: response.data?.response ?? response.data,
        });
        dispatch(getPromotionAssets());
        return response;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_PROMOTION_ASSET_FAILURE,
            payload: error.response?.data?.message || 'Failed to update promotion asset',
        });
        throw error;
    }
};

export const deletePromotionAsset = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_PROMOTION_ASSET_REQUEST });
    try {
        await deletePromotionAssetApi(id);
        dispatch({
            type: types.DELETE_PROMOTION_ASSET_SUCCESS,
            payload: id,
        });
        dispatch(getPromotionAssets());
    } catch (error: any) {
        dispatch({
            type: types.DELETE_PROMOTION_ASSET_FAILURE,
            payload: error.response?.data?.message || 'Failed to delete promotion asset',
        });
        throw error;
    }
};

export const resetStatus = () => (dispatch: any) => {
    dispatch({ type: types.RESET_PROMOTION_ASSET_STATUS });
};
