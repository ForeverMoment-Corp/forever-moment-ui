import * as types from './action-types';
import * as api from './api';

export const getReviewsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_REVIEWS_DATA });
    try {
        const response = await api.fetchReviews();
        dispatch({ type: types.GET_REVIEWS_DATA_SUCCESS, payload: response });
    } catch (error) {
        dispatch({ type: types.GET_REVIEWS_DATA_FAILURE, payload: error });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
