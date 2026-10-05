import * as types from './action-types';

const initialState = {
    data: null as any[] | null,
    loading: false,
    error: null as string | null,
};

export const vendorReducer = (state = initialState, action: any) => {
    switch (action.type) {
        // ── Fetch ────────────────────────────────────────────────────────────
        case types.GET_VENDORS:
            return { ...state, loading: true, error: null };
        case types.GET_VENDORS_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_VENDORS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // ── Create ───────────────────────────────────────────────────────────
        case types.CREATE_VENDOR:
            return { ...state, loading: true, error: null };
        case types.CREATE_VENDOR_SUCCESS:
            return { ...state, loading: false };
        case types.CREATE_VENDOR_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // ── Update ───────────────────────────────────────────────────────────
        case types.UPDATE_VENDOR:
            return { ...state, loading: true, error: null };
        case types.UPDATE_VENDOR_SUCCESS:
            return { ...state, loading: false };
        case types.UPDATE_VENDOR_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // ── Delete ───────────────────────────────────────────────────────────
        case types.DELETE_VENDOR:
            return { ...state, loading: true, error: null };
        case types.DELETE_VENDOR_SUCCESS:
            return {
                ...state,
                loading: false,
                data: state.data
                    ? state.data.filter((v: any) => v.id !== action.payload)
                    : state.data,
            };
        case types.DELETE_VENDOR_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // ── Misc ─────────────────────────────────────────────────────────────
        case types.RESET_STATUS:
            return { ...state, error: null };

        default:
            return state;
    }
};
