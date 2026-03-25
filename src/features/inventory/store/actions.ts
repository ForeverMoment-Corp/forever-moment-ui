import * as types from './action-types';
import * as api from './api';

export const getInventoryData = () => async (dispatch: any) => {
    dispatch({ type: types.GET_INVENTORY_DATA });
    try {
        const data = await api.fetchInventory();
        dispatch({ type: types.GET_INVENTORY_DATA_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: types.GET_INVENTORY_DATA_FAILURE, payload: error.message });
    }
};

export const resetInventoryStatus = () => ({
    type: types.RESET_STATUS,
});
