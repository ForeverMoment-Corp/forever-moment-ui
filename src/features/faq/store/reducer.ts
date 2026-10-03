import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',
};

export const faqReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_FAQ_DATA:
            return { ...state, loading: true };
        case types.GET_FAQ_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_FAQ_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_FAQ:
            return { ...state, loading: true, status: types.CREATE_FAQ, error: null };
        case types.CREATE_FAQ_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_FAQ_SUCCESS };
        case types.CREATE_FAQ_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_FAQ:
            return { ...state, loading: true, status: types.UPDATE_FAQ, error: null };
        case types.UPDATE_FAQ_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_FAQ_SUCCESS };
        case types.UPDATE_FAQ_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_FAQ:
            return { ...state, loading: true, status: types.DELETE_FAQ, error: null };
        case types.DELETE_FAQ_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_FAQ_SUCCESS };
        case types.DELETE_FAQ_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.TOGGLE_FAQ:
        case types.REORDER_FAQ:
            return { ...state, error: null };
        case types.TOGGLE_FAQ_SUCCESS:
        case types.REORDER_FAQ_SUCCESS:
            return state;
        case types.TOGGLE_FAQ_FAILURE:
        case types.REORDER_FAQ_FAILURE:
            return { ...state, error: action.payload };

        case types.RESET_FAQ_STATUS:
            return { ...state, status: 'IDLE', error: null };

        default:
            return state;
    }
};
