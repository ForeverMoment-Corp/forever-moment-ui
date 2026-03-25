import * as types from './action-types';

const initialState = {
    data: [
        { id: 'REV-5001', customerName: 'John Doe', experienceName: 'Romantic Dinner', rating: 5, comment: 'Amazing experience! The setup was beautiful and the food was delicious.', status: 'Approved', date: '2026-03-20' },
        { id: 'REV-5002', customerName: 'Jane Smith', experienceName: 'Birthday Surprise', rating: 4, comment: 'Very well organized. Loved the decorations, but the music could have been better.', status: 'Pending', date: '2026-03-21' },
        { id: 'REV-5003', customerName: 'Alice Johnson', experienceName: 'Proposal Decor', rating: 5, comment: 'She said yes! Thank you for making it so special.', status: 'Approved', date: '2026-03-22' },
        { id: 'REV-5004', customerName: 'Bob Williams', experienceName: 'Pre-wedding Shoot', rating: 3, comment: 'The photographer was late, but the photos turned out okay.', status: 'Hidden', date: '2026-03-23' },
        { id: 'REV-5005', customerName: 'Emma Brown', experienceName: 'Anniversary Date', rating: 4, comment: 'Great service. A bit pricey but worth it.', status: 'Pending', date: '2026-03-24' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const reviewReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_REVIEWS_DATA:
            return { ...state, loading: true };
        case types.GET_REVIEWS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_REVIEWS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
