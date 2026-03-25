import * as types from './action-types';

const initialState = {
    data: {
        stats: [
            { label: 'Total Revenue', value: '₹4,25,000', change: '+12.5%', color: 'emerald' },
            { label: 'Active Bookings', value: '142', change: '+8%', color: 'blue' },
            { label: 'New Customers', value: '28', change: '+15%', color: 'purple' },
            { label: 'Conversion Rate', value: '3.2%', change: '+2.4%', color: 'orange' },
        ],
        topExperiences: [
            { name: 'Romantic Candlelight Dinner', bookings: 45, rating: 4.9 },
            { name: 'Surprise Yacht Party', bookings: 32, rating: 4.8 },
            { name: 'Private Vineyard Tour', bookings: 28, rating: 4.7 },
            { name: 'Luxury Poolside Date', bookings: 22, rating: 4.9 },
        ]
    },
    loading: false,
    error: null,
    status: 'IDLE',
};

export const reportReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_REPORTS_DATA:
            return { ...state, loading: true };
        case types.GET_REPORTS_DATA_SUCCESS:
            return { ...state, loading: false, data: Object.keys(action.payload).length > 0 ? action.payload : state.data };
        case types.GET_REPORTS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
