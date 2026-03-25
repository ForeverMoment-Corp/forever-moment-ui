import * as types from './action-types';

const initialState = {
    data: [
        { id: 'REF-7001', customer: 'Ankit Shukla', bookingId: 'BK-5001', amount: 5000, reason: 'Duplicate Payment', status: 'Completed', date: '2025-10-24' },
        { id: 'REF-7002', customer: 'Priya Sharma', bookingId: 'BK-5002', amount: 12000, reason: 'Venue Concern', status: 'Processing', date: '2025-10-23' },
        { id: 'REF-7003', customer: 'Rahul Verma', bookingId: 'BK-5003', amount: 3000, reason: 'Promo Not Applied', status: 'Pending Approval', date: '2025-10-24' },
        { id: 'REF-7004', customer: 'Sneha Kapur', bookingId: 'BK-5004', amount: 4500, reason: 'Service Quality', status: 'Rejected', date: '2025-10-20' },
        { id: 'REF-7005', customer: 'Vikram Singh', bookingId: 'BK-5005', amount: 15000, reason: 'Customer Change of Mind', status: 'Processing', date: '2025-10-22' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const refundReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_REFUNDS_DATA:
            return { ...state, loading: true };
        case types.GET_REFUNDS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_REFUNDS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
