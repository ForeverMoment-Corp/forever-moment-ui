import * as types from './action-types';
import * as api from './api';

export const getLogsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_LOGS_DATA });
    try {
        const data = await api.fetchLogs();
        dispatch({ type: types.GET_LOGS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_LOGS_DATA_FAILURE, payload: error.message });
    }
};

export const resetLogsStatus = () => ({
    type: types.RESET_STATUS,
});
