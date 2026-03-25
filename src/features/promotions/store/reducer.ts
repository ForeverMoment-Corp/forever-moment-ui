import * as types from './action-types';

const initialState = {
    data: [
        { id: 'PRM-4001', code: 'WELCOME50', type: 'Fixed Amount', value: 500, minSpend: 2000, status: 'Active', usageCount: 142, expiryDate: '2026-12-31' },
        { id: 'PRM-4002', code: 'SUMMER20', type: 'Percentage', value: 20, minSpend: 5000, status: 'Active', usageCount: 85, expiryDate: '2026-08-31' },
        { id: 'PRM-4003', code: 'EARLYBIRD', type: 'Percentage', value: 15, minSpend: 1000, status: 'Scheduled', usageCount: 0, expiryDate: '2026-05-01' },
        { id: 'PRM-4004', code: 'FESTIVE1000', type: 'Fixed Amount', value: 1000, minSpend: 10000, status: 'Expired', usageCount: 320, expiryDate: '2026-01-01' },
        { id: 'PRM-4005', code: 'FIRSTMOMENT', type: 'Percentage', value: 25, minSpend: 0, status: 'Active', usageCount: 56, expiryDate: '2026-12-31' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const promotionReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_PROMOTIONS_DATA:
            return { ...state, loading: true };
        case types.GET_PROMOTIONS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_PROMOTIONS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
