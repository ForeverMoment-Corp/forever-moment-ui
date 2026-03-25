import * as types from './action-types';

const initialState = {
    data: [
        { id: 'PAY-3001', bookingId: 'BKG-1001', customerName: 'John Doe', amount: 1500, method: 'Credit Card', status: 'Captured', date: '2026-04-10' },
        { id: 'PAY-3002', bookingId: 'BKG-1002', customerName: 'Jane Smith', amount: 500, method: 'UPI', status: 'Pending', date: '2026-04-15' },
        { id: 'PAY-3003', bookingId: 'BKG-1003', customerName: 'Alice Johnson', amount: 2000, method: 'Net Banking', status: 'Refunded', date: '2026-05-02' },
        { id: 'PAY-3004', bookingId: 'BKG-1004', customerName: 'Bob Williams', amount: 800, method: 'Credit Card', status: 'Captured', date: '2026-05-10' },
        { id: 'PAY-3005', bookingId: 'BKG-1005', customerName: 'Emma Brown', amount: 1200, method: 'Cash', status: 'Captured', date: '2026-06-20' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const paymentReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_PAYMENTS_DATA:
            return { ...state, loading: true };
        case types.GET_PAYMENTS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_PAYMENTS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
