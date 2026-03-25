import * as types from './action-types';

const initialState = {
    data: [
        { id: 'NTF-5001', type: 'Email', recipient: 'ankit@example.com', subject: 'Booking Confirmed!', status: 'Delivered', date: '2025-10-24 10:30 AM', template: 'Booking Confirmation' },
        { id: 'NTF-5002', type: 'SMS', recipient: '+91 9876543210', subject: 'OTP for Login', status: 'Sent', date: '2025-10-24 10:45 AM', template: 'Auth OTP' },
        { id: 'NTF-5003', type: 'WhatsApp', recipient: '+91 8765432109', subject: 'Reminder: Tomorrow\'s Experience', status: 'Failed', date: '2025-10-23 05:00 PM', template: 'Experience Alert' },
        { id: 'NTF-5004', type: 'Email', recipient: 'priya@example.com', subject: 'How was your date?', status: 'Delivered', date: '2025-10-22 09:00 AM', template: 'Feedback Request' },
        { id: 'NTF-5005', type: 'Email', recipient: 'support@forevermoment.com', subject: 'New Vendor Application', status: 'Processing', date: '2025-10-24 11:00 AM', template: 'Admin Alert' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const notificationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_NOTIFICATIONS_DATA:
            return { ...state, loading: true };
        case types.GET_NOTIFICATIONS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_NOTIFICATIONS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
