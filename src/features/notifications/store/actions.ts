import * as types from './action-types';
import * as api from './api';

export const getNotificationsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_NOTIFICATIONS_DATA });
    try {
        const data = await api.fetchNotifications();
        dispatch({ type: types.GET_NOTIFICATIONS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_NOTIFICATIONS_DATA_FAILURE, payload: error.message });
    }
};

export const resetNotificationsStatus = () => ({
    type: types.RESET_STATUS,
});
