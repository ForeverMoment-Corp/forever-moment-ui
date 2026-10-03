import * as types from './action-types';
import * as api from './api';

const errorMessage = (error: any, fallback: string) =>
    error.response?.data?.msg || error.response?.data?.message || fallback;

export const getSupportQueries = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_SUPPORT_QUERIES });
    }
    try {
        const response = await api.fetchSupportQueries();
        dispatch({ type: types.GET_SUPPORT_QUERIES_SUCCESS, payload: response.data.response || [] });
    } catch (error: any) {
        dispatch({
            type: types.GET_SUPPORT_QUERIES_FAILURE,
            payload: errorMessage(error, 'Failed to fetch support queries'),
        });
    }
};

export const resolveSupportQuery = (id: number) => async (dispatch: any) => {
    dispatch({ type: types.RESOLVE_SUPPORT_QUERY });
    try {
        const response = await api.resolveSupportQueryApi(id);
        // The endpoint returns the updated query, so patch it in place instead of refetching
        dispatch({ type: types.RESOLVE_SUPPORT_QUERY_SUCCESS, payload: response.data.response });
        return response.data.response;
    } catch (error: any) {
        dispatch({
            type: types.RESOLVE_SUPPORT_QUERY_FAILURE,
            payload: errorMessage(error, 'Failed to resolve support query'),
        });
        throw error;
    }
};

export const resetHelpdeskStatus = () => ({
    type: types.RESET_STATUS,
});
