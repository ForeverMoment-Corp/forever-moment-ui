import * as types from './action-types';

interface AddonState {
    data: types.AddonType[] | null;
    selectedAddonDetail: any | null;
    loading: boolean;
    error: string | null;
    status: string;
}

const initialState: AddonState = {
    data: null,
    selectedAddonDetail: null,
    loading: false,
    error: null,
    status: '',
};

export const addonReducer = (state = initialState, action: any): AddonState => {
    switch (action.type) {
        // Fetch All
        case types.GET_ADDON_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.GET_ADDON_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case types.GET_ADDON_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Fetch By ID
        case types.GET_ADDON_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                selectedAddonDetail: null,
            };
        case types.GET_ADDON_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedAddonDetail: action.payload,
            };
        case types.GET_ADDON_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Create
        case types.ADD_ADDON_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                status: types.ADD_ADDON_REQUEST,
            };
        case types.ADD_ADDON_SUCCESS:
            return {
                ...state,
                loading: false,
                status: types.ADD_ADDON_SUCCESS,
            };
        case types.ADD_ADDON_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: types.ADD_ADDON_FAILURE,
            };

        // Update
        case types.UPDATE_ADDON_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                status: types.UPDATE_ADDON_REQUEST,
            };
        case types.UPDATE_ADDON_SUCCESS:
            return {
                ...state,
                loading: false,
                status: types.UPDATE_ADDON_SUCCESS,
            };
        case types.UPDATE_ADDON_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: types.UPDATE_ADDON_FAILURE,
            };

        // Delete
        case types.DELETE_ADDON_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                status: types.DELETE_ADDON_REQUEST,
            };
        case types.DELETE_ADDON_SUCCESS:
            return {
                ...state,
                loading: false,
                status: types.DELETE_ADDON_SUCCESS,
            };
        case types.DELETE_ADDON_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: types.DELETE_ADDON_FAILURE,
            };

        // Image upload / remove
        case types.UPLOAD_ADDON_IMAGE_REQUEST:
        case types.REMOVE_ADDON_IMAGE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                status: action.type,
            };
        case types.UPLOAD_ADDON_IMAGE_SUCCESS:
        case types.REMOVE_ADDON_IMAGE_SUCCESS: {
            const updated = action.payload;
            const list = Array.isArray(state.data) ? state.data : null;
            return {
                ...state,
                loading: false,
                status: action.type,
                // Patch the row in place so the thumbnail updates before the list refetch lands.
                data: list && updated?.id != null
                    ? list.map((a) => (String(a.id) === String(updated.id) ? { ...a, ...updated } : a))
                    : list,
            };
        }
        case types.UPLOAD_ADDON_IMAGE_FAILURE:
        case types.REMOVE_ADDON_IMAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: action.type,
            };

        case types.RESET_ADDON_STATUS:
            return {
                ...state,
                status: '',
                error: null,
            };

        default:
            return state;
    }
};
