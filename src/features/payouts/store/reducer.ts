import * as types from './action-types';

const initialState = {
    data: [
        { id: 'PAY-8001', vendor: 'Gourmet Delights', amount: 45000, commission: 4500, netPayout: 40500, status: 'Completed', date: '2025-10-20', period: 'Oct 1 - Oct 15' },
        { id: 'PAY-8002', vendor: 'Elite Photography', amount: 80000, commission: 8000, netPayout: 72000, status: 'Pending', date: '2025-10-25', period: 'Oct 16 - Oct 31' },
        { id: 'PAY-8003', vendor: 'Floral Fantasy', amount: 15000, commission: 1500, netPayout: 13500, status: 'Scheduled', date: '2025-11-01', period: 'Oct 16 - Oct 31' },
        { id: 'PAY-8004', vendor: 'Ocean Cruises', amount: 120000, commission: 12000, netPayout: 108000, status: 'Processing', date: '2025-10-22', period: 'Oct 1 - Oct 15' },
        { id: 'PAY-8005', vendor: 'Luxe Decorators', amount: 65000, commission: 6500, netPayout: 58500, status: 'Completed', date: '2025-10-15', period: 'Sep 16 - Sep 30' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const paymentPayoutReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_PAYOUTS_DATA:
            return { ...state, loading: true };
        case types.GET_PAYOUTS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_PAYOUTS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
