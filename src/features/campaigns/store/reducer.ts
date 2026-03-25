import * as types from './action-types';

const initialState = {
    data: [
        { id: 'CMP-201', name: 'Valentine\'s Week Special', budget: 50000, leads: 450, conversions: 120, status: 'Active', roi: '3.5x' },
        { id: 'CMP-202', name: 'Summer Yacht Parties', budget: 30000, leads: 210, conversions: 45, status: 'Active', roi: '2.1x' },
        { id: 'CMP-203', name: 'Winter Honeymoon Sale', budget: 20000, leads: 180, conversions: 32, status: 'Completed', roi: '1.8x' },
        { id: 'CMP-204', name: 'New Year Bash 2026', budget: 100000, leads: 0, conversions: 0, status: 'Scheduled', roi: 'N/A' },
        { id: 'CMP-205', name: 'Corporate Team Outings', budget: 15000, leads: 95, conversions: 12, status: 'Paused', roi: '0.9x' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const campaignReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_CAMPAIGNS_DATA:
            return { ...state, loading: true };
        case types.GET_CAMPAIGNS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_CAMPAIGNS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
