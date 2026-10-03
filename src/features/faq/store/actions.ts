import * as types from './action-types';
import {
    fetchFaqData, createFaqApi, updateFaqApi, deleteFaqApi, toggleFaqApi, reorderFaqApi,
    type FaqPayload
} from './api';

const errorMessage = (error: any, fallback: string) =>
    error.response?.data?.msg || error.response?.data?.message || fallback;

export const getFaqData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_FAQ_DATA });
    }
    try {
        const response = await fetchFaqData();
        dispatch({
            type: types.GET_FAQ_DATA_SUCCESS,
            payload: response.data.response || [],
        });
        return response.data.response;
    } catch (error: any) {
        dispatch({
            type: types.GET_FAQ_DATA_FAILURE,
            payload: errorMessage(error, 'Failed to fetch FAQs'),
        });
    }
};

export const createFaq = (data: FaqPayload) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_FAQ });
    try {
        const response = await createFaqApi(data);
        dispatch({ type: types.CREATE_FAQ_SUCCESS, payload: response.data.response });
        dispatch(getFaqData(true));
        return response.data.response;
    } catch (error: any) {
        dispatch({
            type: types.CREATE_FAQ_FAILURE,
            payload: errorMessage(error, 'Failed to create FAQ'),
        });
        throw error;
    }
};

export const updateFaq = (id: number, data: FaqPayload) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_FAQ });
    try {
        const response = await updateFaqApi(id, data);
        dispatch({ type: types.UPDATE_FAQ_SUCCESS, payload: response.data.response });
        dispatch(getFaqData(true));
        return response.data.response;
    } catch (error: any) {
        dispatch({
            type: types.UPDATE_FAQ_FAILURE,
            payload: errorMessage(error, 'Failed to update FAQ'),
        });
        throw error;
    }
};

export const deleteFaq = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_FAQ });
    try {
        await deleteFaqApi(id);
        dispatch({ type: types.DELETE_FAQ_SUCCESS, payload: id });
        dispatch(getFaqData(true));
    } catch (error: any) {
        dispatch({
            type: types.DELETE_FAQ_FAILURE,
            payload: errorMessage(error, 'Failed to delete FAQ'),
        });
        throw error;
    }
};

export const toggleFaq = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.TOGGLE_FAQ });
    try {
        await toggleFaqApi(id);
        dispatch({ type: types.TOGGLE_FAQ_SUCCESS, payload: id });
        dispatch(getFaqData(true));
    } catch (error: any) {
        dispatch({
            type: types.TOGGLE_FAQ_FAILURE,
            payload: errorMessage(error, 'Failed to update FAQ status'),
        });
        throw error;
    }
};

export const reorderFaq = (orderedIds: number[]) => async (dispatch: any) => {
    dispatch({ type: types.REORDER_FAQ });
    try {
        await reorderFaqApi(orderedIds);
        dispatch({ type: types.REORDER_FAQ_SUCCESS });
        await dispatch(getFaqData(true));
    } catch (error: any) {
        dispatch({
            type: types.REORDER_FAQ_FAILURE,
            payload: errorMessage(error, 'Failed to reorder FAQs'),
        });
        throw error;
    }
};

export const resetFaqStatus = () => ({
    type: types.RESET_FAQ_STATUS,
});
