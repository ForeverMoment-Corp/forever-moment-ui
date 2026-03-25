import * as types from './action-types';

const initialState = {
    data: [
        { id: 'WLT-1001', customer: 'Ankit Shukla', experience: 'Private Yacht Sunsets', people: 2, priority: 'Normal', status: 'Waiting', date: '2025-10-24', joinTime: '10:00 AM' },
        { id: 'WLT-1002', customer: 'Priya Sharma', experience: 'Helicopter Date Night', people: 2, priority: 'High', status: 'Notified', date: '2025-10-24', joinTime: '09:30 AM' },
        { id: 'WLT-1003', customer: 'Rahul Verma', experience: 'Private Cinema for Two', people: 2, priority: 'Normal', status: 'Waiting', date: '2025-10-24', joinTime: '11:15 AM' },
        { id: 'WLT-1004', customer: 'Sneha Kapur', experience: 'Hot Air Balloon Ride', people: 4, priority: 'High', status: 'Confirmed', date: '2025-10-23', joinTime: '08:00 AM' },
        { id: 'WLT-1005', customer: 'Vikram Singh', experience: 'Luxury Resort Gala', people: 2, priority: 'Normal', status: 'Expired', date: '2025-10-22', joinTime: '02:00 PM' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const waitlistReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_WAITLIST_DATA:
            return { ...state, loading: true };
        case types.GET_WAITLIST_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_WAITLIST_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
