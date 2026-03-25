import * as types from './action-types';
import * as api from './api';

export const getInvoicesData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_INVOICES_DATA });
    try {
        const data = await api.fetchInvoices();
        dispatch({ type: types.GET_INVOICES_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_INVOICES_DATA_FAILURE, payload: error.message });
    }
};

export const resetInvoicesStatus = () => ({
    type: types.RESET_STATUS,
});
