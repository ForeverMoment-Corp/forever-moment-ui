import * as types from './action-types';
import * as api from './api';

export const getPromotionsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_PROMOTIONS_DATA });
    try {
        const response = await api.fetchPromotions();
        dispatch({ type: types.GET_PROMOTIONS_DATA_SUCCESS, payload: response });
    } catch (error) {
        dispatch({ type: types.GET_PROMOTIONS_DATA_FAILURE, payload: error });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
