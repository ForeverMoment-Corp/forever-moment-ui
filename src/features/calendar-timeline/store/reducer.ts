import * as types from './action-types';

const initialState = {
    data: [
        { id: 'EVT-001', title: 'Private Candlelight Dinner', start: '2025-10-24 19:00', end: '2025-10-24 22:00', type: 'Experience', vendor: 'Gourmet Delights', status: 'Confirmed' },
        { id: 'EVT-002', title: 'Pre-wedding Shoot', start: '2025-10-24 07:00', end: '2025-10-24 11:00', type: 'Photography', vendor: 'Elite Photography', status: 'In Progress' },
        { id: 'EVT-003', title: 'Birthday Bash Decor', start: '2025-10-25 10:00', end: '2025-10-25 14:00', type: 'Operations', vendor: 'Luxe Decorators', status: 'Scheduled' },
        { id: 'EVT-004', title: 'Yacht Party Setup', start: '2025-10-24 15:00', end: '2025-10-24 17:00', type: 'Vendor Visit', vendor: 'Ocean Cruises', status: 'Completed' },
        { id: 'EVT-005', title: 'Review: Floral Stock', start: '2025-10-24 12:00', end: '2025-10-24 13:00', type: 'Internal', vendor: 'N/A', status: 'Pending' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const timelineReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_TIMELINE_DATA:
            return { ...state, loading: true };
        case types.GET_TIMELINE_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_TIMELINE_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
