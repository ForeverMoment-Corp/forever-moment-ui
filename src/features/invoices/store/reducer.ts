import * as types from './action-types';

const initialState = {
    data: [
        { id: 'INV-2025-001', customer: 'Ankit Shukla', bookingId: 'BK-5001', amount: 15000, tax: 2700, total: 17700, status: 'Paid', date: '2025-10-20' },
        { id: 'INV-2025-002', customer: 'Priya Sharma', bookingId: 'BK-5002', amount: 8000, tax: 1440, total: 9440, status: 'Overdue', date: '2025-10-15' },
        { id: 'INV-2025-003', customer: 'Rahul Verma', bookingId: 'BK-5003', amount: 5000, tax: 900, total: 5900, status: 'Paid', date: '2025-10-22' },
        { id: 'INV-2025-004', customer: 'Sneha Kapur', bookingId: 'BK-5004', amount: 12000, tax: 2160, total: 14160, status: 'Pending', date: '2025-10-24' },
        { id: 'INV-2025-005', customer: 'Vikram Singh', bookingId: 'BK-5005', amount: 25000, tax: 4500, total: 29500, status: 'Draft', date: '2025-10-25' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const invoiceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_INVOICES_DATA:
            return { ...state, loading: true };
        case types.GET_INVOICES_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_INVOICES_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
