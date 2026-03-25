import * as types from './action-types';

const initialState = {
    data: [
        { id: 'LOG-3001', user: 'Admin User', action: 'Modified Sub Category', module: 'Products', details: 'Changed price for "Premium Decor"', status: 'Success', date: '2025-10-24 11:30 AM' },
        { id: 'LOG-3002', user: 'System', action: 'Auto-cancelled Booking', module: 'Bookings', details: 'Payment timeout for BK-5002', status: 'System', date: '2025-10-24 10:15 AM' },
        { id: 'LOG-3003', user: 'Ankit Shukla', action: 'Created Promotion', module: 'Marketing', details: 'New code: DIWALI50', status: 'Success', date: '2025-10-24 09:00 AM' },
        { id: 'LOG-3004', user: 'Vendor Portal', action: 'Update Inventory', module: 'Operations', details: 'Gourmet Delights updated stock', status: 'Success', date: '2025-10-23 05:45 PM' },
        { id: 'LOG-3005', user: 'Admin User', action: 'Deleted User', module: 'Users', details: 'Removed access for temporary-staff@fm.com', status: 'Warning', date: '2025-10-23 04:30 PM' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const logsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_LOGS_DATA:
            return { ...state, loading: true };
        case types.GET_LOGS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_LOGS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
