import * as types from './action-types';
import * as api from './api';

export const getTicketsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_TICKETS_DATA });
    try {
        const data = await api.fetchTickets();
        dispatch({ type: types.GET_TICKETS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_TICKETS_DATA_FAILURE, payload: error.message });
    }
};

export const resetHelpdeskStatus = () => ({
    type: types.RESET_STATUS,
});
