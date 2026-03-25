import * as types from './action-types';
import * as api from './api';

export const getCampaignsData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_CAMPAIGNS_DATA });
    try {
        const data = await api.fetchCampaigns();
        dispatch({ type: types.GET_CAMPAIGNS_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_CAMPAIGNS_DATA_FAILURE, payload: error.message });
    }
};

export const resetCampaignsStatus = () => ({
    type: types.RESET_STATUS,
});
