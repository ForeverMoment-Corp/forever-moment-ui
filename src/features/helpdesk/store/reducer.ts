import * as types from './action-types';

const initialState = {
    data: [
        { id: 'TCK-101', subject: 'Refund for Cancelled Booking', customer: 'Ankit Shukla', priority: 'High', status: 'Open', category: 'Finance', date: '2025-10-24' },
        { id: 'TCK-102', subject: 'Experience Venue Location Issue', customer: 'Priya Sharma', priority: 'Medium', status: 'Processing', category: 'Experience', date: '2025-10-23' },
        { id: 'TCK-103', subject: 'Unable to Apply Promo Code', customer: 'Rahul Verma', priority: 'Low', status: 'Resolved', category: 'Marketing', date: '2025-10-22' },
        { id: 'TCK-104', subject: 'Vendor Delayed Cleanup', customer: 'Sneha Kapur', priority: 'High', status: 'Pending', category: 'Operations', date: '2025-10-24' },
        { id: 'TCK-105', subject: 'Add-on Not Delivered', customer: 'Vikram Singh', priority: 'Medium', status: 'Open', category: 'Experience', date: '2025-10-24' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const helpdeskReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_TICKETS_DATA:
            return { ...state, loading: true };
        case types.GET_TICKETS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_TICKETS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
