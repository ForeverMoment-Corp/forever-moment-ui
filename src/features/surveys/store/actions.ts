import * as types from './action-types';
import * as api from './api';

export const getSurveysData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_SURVEYS_DATA });
    try {
        const data = await api.fetchSurveys();
        dispatch({ type: types.GET_SURVEYS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_SURVEYS_DATA_FAILURE, payload: error.message });
    }
};

export const resetSurveysStatus = () => ({
    type: types.RESET_STATUS,
});
