import * as types from './action-types';
import * as api from './api';

export const getPromotionsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_PROMOTIONS_DATA });
    try {
        const response: any = await api.fetchPromotions();
        const payload = response.data?.response || response.data || [];
        dispatch({ type: types.GET_PROMOTIONS_DATA_SUCCESS, payload });
    } catch (error) {
        dispatch({ type: types.GET_PROMOTIONS_DATA_FAILURE, payload: error });
    }
};

export const createPromotionAction = (data: any) => async (dispatch: any) => {
    dispatch({ type: types.CREATE_PROMOTION });
    try {
        const response: any = await api.createPromotion(data);
        dispatch({ type: types.CREATE_PROMOTION_SUCCESS, payload: response.data || response });
        dispatch(getPromotionsData() as any);
    } catch (error) {
        dispatch({ type: types.CREATE_PROMOTION_FAILURE, payload: error });
    }
};

export const updatePromotionAction = (id: number | string, data: any) => async (dispatch: any) => {
    dispatch({ type: types.UPDATE_PROMOTION });
    try {
        const response: any = await api.updatePromotion(id, data);
        dispatch({ type: types.UPDATE_PROMOTION_SUCCESS, payload: response.data || response });
        dispatch(getPromotionsData() as any);
    } catch (error) {
        dispatch({ type: types.UPDATE_PROMOTION_FAILURE, payload: error });
    }
};

export const deletePromotionAction = (id: number | string) => async (dispatch: any) => {
    dispatch({ type: types.DELETE_PROMOTION });
    try {
        await api.deletePromotion(id);
        dispatch({ type: types.DELETE_PROMOTION_SUCCESS, payload: id });
        dispatch(getPromotionsData() as any);
    } catch (error) {
        dispatch({ type: types.DELETE_PROMOTION_FAILURE, payload: error });
    }
};

export const resetStatus = () => ({
    type: types.RESET_STATUS,
});
