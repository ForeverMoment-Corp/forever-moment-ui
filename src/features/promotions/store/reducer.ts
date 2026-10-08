import * as types from './action-types';

const initialState = {
    data: [],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const promotionReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_PROMOTIONS_DATA:
        case types.CREATE_PROMOTION:
        case types.UPDATE_PROMOTION:
        case types.DELETE_PROMOTION:
            return { ...state, loading: true, status: 'LOADING' };
            
        case types.GET_PROMOTIONS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload, status: 'SUCCESS' };
            
        case types.CREATE_PROMOTION_SUCCESS:
        case types.UPDATE_PROMOTION_SUCCESS:
        case types.DELETE_PROMOTION_SUCCESS:
            return { ...state, loading: false, status: 'SUCCESS' };
            
        case types.GET_PROMOTIONS_DATA_FAILURE:
        case types.CREATE_PROMOTION_FAILURE:
        case types.UPDATE_PROMOTION_FAILURE:
        case types.DELETE_PROMOTION_FAILURE:
            return { ...state, loading: false, error: action.payload, status: 'FAILURE' };
            
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
            
        default:
            return state;
    }
};
