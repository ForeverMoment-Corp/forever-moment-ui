import * as types from './action-types';
import * as api from './api';

export const getRefundsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_REFUNDS_DATA });
    try {
        const data = await api.fetchRefunds();
        dispatch({ type: types.GET_REFUNDS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_REFUNDS_DATA_FAILURE, payload: error.message });
    }
};

export const resetRefundsStatus = () => ({
    type: types.RESET_STATUS,
});
