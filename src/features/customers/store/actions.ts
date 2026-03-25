import * as types from './action-types';
import * as api from './api';

export const getCustomersData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_CUSTOMERS_DATA });
    try {
        const response = await api.fetchCustomers();
        dispatch({ type: types.GET_CUSTOMERS_DATA_SUCCESS, payload: response });
    } catch (error) {
        dispatch({ type: types.GET_CUSTOMERS_DATA_FAILURE, payload: error });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
