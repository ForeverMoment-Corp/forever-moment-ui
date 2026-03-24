import * as types from './action-types';

export const getBookingsData = (isBackground: boolean = false) => async (dispatch: any) => {
    if (!isBackground) {
        dispatch({ type: types.GET_BOOKINGS_DATA });
    }

    // Since we're using dummy data for now, simulate an API call
    setTimeout(() => {
        dispatch({
            type: types.GET_BOOKINGS_DATA_SUCCESS,
            payload: [], // Using dummy data on the component side
        });
    }, 500);

    /*
    try {
        const response = await fetchBookingsData();
        dispatch({
            type: types.GET_BOOKINGS_DATA_SUCCESS,
            payload: response?.data?.response || [],
        });
    } catch (error: any) {
        dispatch({
            type: types.GET_BOOKINGS_DATA_FAILURE,
            payload: error.response?.data?.message || 'Failed to fetch bookings',
        });
    }
    */
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
