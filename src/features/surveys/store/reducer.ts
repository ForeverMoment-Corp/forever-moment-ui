import * as types from './action-types';

const initialState = {
    data: [
        { id: 'SRV-001', title: 'Post-Experience Feedback', responses: 45, avgRating: 4.8, status: 'Active', lastResponse: '2025-10-24' },
        { id: 'SRV-002', title: 'Vendor Quality Check', responses: 12, avgRating: 4.2, status: 'Active', lastResponse: '2025-10-23' },
        { id: 'SRV-003', title: 'Website Usability Survey', responses: 120, avgRating: 4.5, status: 'Closed', lastResponse: '2025-09-15' },
        { id: 'SRV-004', title: 'New Packages Interest', responses: 28, avgRating: 4.9, status: 'Draft', lastResponse: 'N/A' },
        { id: 'SRV-005', title: 'Customer Satisfaction Q4', responses: 0, avgRating: 0, status: 'Scheduled', lastResponse: 'N/A' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const surveyReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_SURVEYS_DATA:
            return { ...state, loading: true };
        case types.GET_SURVEYS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_SURVEYS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
