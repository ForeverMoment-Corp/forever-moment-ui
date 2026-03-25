import * as types from './action-types';
import * as api from './api';

export const getReportsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_REPORTS_DATA });
    try {
        const response = await api.fetchReports();
        dispatch({ type: types.GET_REPORTS_DATA_SUCCESS, payload: response });
    } catch (error) {
        dispatch({ type: types.GET_REPORTS_DATA_FAILURE, payload: error });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
