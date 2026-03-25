import * as types from './action-types';
import * as api from './api';

export const getCMSData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_CMS_DATA });
    try {
        const data = await api.fetchCMS();
        dispatch({ type: types.GET_CMS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_CMS_DATA_FAILURE, payload: error.message });
    }
};

export const resetCMSStatus = () => ({
    type: types.RESET_STATUS,
});
