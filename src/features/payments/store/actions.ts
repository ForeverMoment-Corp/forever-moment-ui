import * as types from './action-types';
import * as api from './api';

export const getPaymentsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_PAYMENTS_DATA });
    try {
        const response = await api.fetchPayments();
        dispatch({ type: types.GET_PAYMENTS_DATA_SUCCESS, payload: response });
    } catch (error) {
        dispatch({ type: types.GET_PAYMENTS_DATA_FAILURE, payload: error });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
