import * as types from './action-types';
import * as api from './api';

export const getWaitlistData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_WAITLIST_DATA });
    try {
        const data = await api.fetchWaitlist();
        dispatch({ type: types.GET_WAITLIST_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_WAITLIST_DATA_FAILURE, payload: error.message });
    }
};

export const resetWaitlistStatus = () => ({
    type: types.RESET_STATUS,
});
