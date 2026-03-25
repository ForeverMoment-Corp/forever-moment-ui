import * as types from './action-types';
import * as api from './api';

export const getPayoutsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_PAYOUTS_DATA });
    try {
        const data = await api.fetchPayouts();
        dispatch({ type: types.GET_PAYOUTS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_PAYOUTS_DATA_FAILURE, payload: error.message });
    }
};

export const resetPayoutsStatus = () => ({
    type: types.RESET_STATUS,
});
