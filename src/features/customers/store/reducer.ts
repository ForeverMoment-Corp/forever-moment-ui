import * as types from './action-types';

const initialState = {
    data: [
        { id: 'CST-2001', name: 'Ankit Shukla', email: 'ankit@example.com', phone: '+91 9876543210', totalBookings: 12, totalSpent: 45000, status: 'VIP', joinDate: '2025-01-15' },
        { id: 'CST-2002', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 8765432109', totalBookings: 5, totalSpent: 12500, status: 'Active', joinDate: '2025-03-20' },
        { id: 'CST-2003', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 7654321098', totalBookings: 1, totalSpent: 2000, status: 'Inactive', joinDate: '2025-06-10' },
        { id: 'CST-2004', name: 'Sneha Kapur', email: 'sneha@example.com', phone: '+91 6543210987', totalBookings: 8, totalSpent: 28000, status: 'VIP', joinDate: '2025-02-05' },
        { id: 'CST-2005', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 5432109876', totalBookings: 3, totalSpent: 7500, status: 'Active', joinDate: '2025-05-12' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const customerReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_CUSTOMERS_DATA:
            return { ...state, loading: true };
        case types.GET_CUSTOMERS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_CUSTOMERS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
