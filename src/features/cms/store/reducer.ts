import * as types from './action-types';

const initialState = {
    data: [
        { id: 'PAGE-001', title: 'Honeymoon Special Landing', route: '/offers/honeymoon', author: 'Marketing Team', lastModified: '2025-10-24 11:30 AM', status: 'Published' },
        { id: 'PAGE-002', title: 'Home Page Hero Banner', route: '/', author: 'Ankit Shukla', lastModified: '2025-10-24 10:15 AM', status: 'Draft' },
        { id: 'PAGE-003', title: 'Luxury Yacht Experiences', route: '/exp/yacht', author: 'Experience Team', lastModified: '2025-10-24 09:00 AM', status: 'Published' },
        { id: 'PAGE-004', title: 'Vendor Onboarding Guide', route: '/vendor-help', author: 'Operations', lastModified: '2025-10-23 05:45 PM', status: 'Archived' },
        { id: 'PAGE-005', title: 'Diwali Festive Decor 2025', route: '/event/diwali', author: 'Design Team', lastModified: '2025-10-23 04:30 PM', status: 'Draft' },
    ],
    loading: false,
    error: null,
    status: 'IDLE',
};

export const cmsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_CMS_DATA:
            return { ...state, loading: true };
        case types.GET_CMS_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.length > 0 ? action.payload : state.data };
        case types.GET_CMS_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
