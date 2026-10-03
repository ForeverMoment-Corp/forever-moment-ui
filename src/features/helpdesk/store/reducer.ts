import * as types from './action-types';
import type { SupportQuery } from './api';

interface HelpdeskState {
    data: SupportQuery[];
    loading: boolean;
    resolving: boolean;
    error: string | null;
    status: string;
}

const initialState: HelpdeskState = {
    data: [],
    loading: false,
    resolving: false,
    error: null,
    status: 'IDLE',
};

export const helpdeskReducer = (state = initialState, action: any): HelpdeskState => {
    switch (action.type) {
        case types.GET_SUPPORT_QUERIES:
            return { ...state, loading: true, error: null };
        case types.GET_SUPPORT_QUERIES_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_SUPPORT_QUERIES_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESOLVE_SUPPORT_QUERY:
            return { ...state, resolving: true, error: null };
        case types.RESOLVE_SUPPORT_QUERY_SUCCESS:
            return {
                ...state,
                resolving: false,
                data: state.data.map(q => (q.id === action.payload.id ? action.payload : q)),
            };
        case types.RESOLVE_SUPPORT_QUERY_FAILURE:
            return { ...state, resolving: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };
        default:
            return state;
    }
};
