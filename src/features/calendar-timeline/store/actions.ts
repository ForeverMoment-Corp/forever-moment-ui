import * as types from './action-types';
import * as api from './api';

export const getTimelineData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_TIMELINE_DATA });
    try {
        const data = await api.fetchTimeline();
        dispatch({ type: types.GET_TIMELINE_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_TIMELINE_DATA_FAILURE, payload: error.message });
    }
};

export const resetTimelineStatus = () => ({
    type: types.RESET_STATUS,
});
