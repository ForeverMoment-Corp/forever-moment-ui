import * as types from './action-types';

const initialState = {
    data: [],
    loading: false,
    error: null,
    status: 'IDLE',

    attachedLocations: [],
    loadingLocations: false,
    locationError: null,
};

export const subCategoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_SUB_CATEGORY_DATA:
            return { ...state, loading: true };
        case types.CREATE_SUB_CATEGORY:
            return { ...state, loading: true, status: types.CREATE_SUB_CATEGORY, error: null };
        case types.UPDATE_SUB_CATEGORY:
            return { ...state, loading: true, status: types.UPDATE_SUB_CATEGORY, error: null };
        case types.DELETE_SUB_CATEGORY:
            return { ...state, loading: true, status: types.DELETE_SUB_CATEGORY, error: null };
        case types.ASSOCIATE_LOCATION:
            return { ...state, loading: true, status: types.ASSOCIATE_LOCATION, error: null };
        case types.DISASSOCIATE_LOCATION:
            return { ...state, loading: true, status: types.DISASSOCIATE_LOCATION, error: null };

        case types.GET_SUB_CATEGORY_DATA_SUCCESS:
            // Ensure payload is always an array
            return { ...state, loading: false, data: Array.isArray(action.payload) ? action.payload : [] };
        case types.CREATE_SUB_CATEGORY_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_SUB_CATEGORY_SUCCESS, data: [...state.data, action.payload] };
        case types.UPDATE_SUB_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                status: types.UPDATE_SUB_CATEGORY_SUCCESS,
                data: state.data.map((item: any) => item.id === action.payload.id ? action.payload : item)
            };
        case types.DELETE_SUB_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                status: types.DELETE_SUB_CATEGORY_SUCCESS,
                data: state.data.filter((item: any) => item.id !== action.payload)
            };
        case types.ASSOCIATE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.ASSOCIATE_LOCATION_SUCCESS };
        case types.DISASSOCIATE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.DISASSOCIATE_LOCATION_SUCCESS };

        case types.GET_SUB_CATEGORY_DATA_FAILURE:
        case types.CREATE_SUB_CATEGORY_FAILURE:
        case types.UPDATE_SUB_CATEGORY_FAILURE:
        case types.DELETE_SUB_CATEGORY_FAILURE:
        case types.ASSOCIATE_LOCATION_FAILURE:
        case types.DISASSOCIATE_LOCATION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        case types.GET_SUB_CATEGORY_LOCATIONS:
            return { ...state, loadingLocations: true };
        case types.GET_SUB_CATEGORY_LOCATIONS_SUCCESS:
            return { ...state, loadingLocations: false, attachedLocations: Array.isArray(action.payload) ? action.payload : [] };
        case types.GET_SUB_CATEGORY_LOCATIONS_FAILURE:
            return { ...state, loadingLocations: false, locationError: action.payload };

        default:
            return state;
    }
};
