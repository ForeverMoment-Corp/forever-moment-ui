import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const bookingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_BOOKINGS_DATA:
            return { ...state, loading: true };
        case types.GET_BOOKINGS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_BOOKINGS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
