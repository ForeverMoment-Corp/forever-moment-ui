import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',

    pincodes: [],
    loadingPincodes: false,
    pincodeError: null,
    pincodeStatus: 'IDLE',

    subCategories: [],
    loadingSubCategories: false,
    subCategoryError: null,

    categories: [],
    loadingCategories: false,
    categoryError: null,

    /** Flat category ↔ location junction rows across every location. */
    categoryLocationLinks: [] as any[],
    loadingCategoryLinks: false,
    /** Flat sub-category ↔ location junction rows across every location. */
    subCategoryLocationLinks: [] as any[],
    loadingSubCategoryLinks: false,
    linkError: null as string | null,
};

export const locationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_LOCATION_DATA:
            return { ...state, loading: true };
        case types.GET_LOCATION_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_LOCATION_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_LOCATION:
            return { ...state, loading: true, status: types.CREATE_LOCATION, error: null };
        case types.CREATE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_LOCATION_SUCCESS };
        case types.CREATE_LOCATION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_LOCATION:
            return { ...state, loading: true, status: types.DELETE_LOCATION, error: null };
        case types.DELETE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_LOCATION_SUCCESS };
        case types.DELETE_LOCATION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_LOCATION:
            return { ...state, loading: true, status: types.UPDATE_LOCATION, error: null };
        case types.UPDATE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_LOCATION_SUCCESS };
        case types.UPDATE_LOCATION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null, pincodeStatus: 'IDLE', pincodeError: null };

        // Pincode Cases
        case types.GET_PINCODE_DATA:
            return { ...state, loadingPincodes: true };
        case types.GET_PINCODE_DATA_SUCCESS:
            return { ...state, loadingPincodes: false, pincodes: action.payload };
        case types.GET_PINCODE_DATA_FAILURE:
            return { ...state, loadingPincodes: false, pincodeError: action.payload };

        case types.CREATE_PINCODE:
            return { ...state, loadingPincodes: true, pincodeStatus: types.CREATE_PINCODE, pincodeError: null };
        case types.CREATE_PINCODE_SUCCESS:
            return { ...state, loadingPincodes: false, pincodeStatus: types.CREATE_PINCODE_SUCCESS };
        case types.CREATE_PINCODE_FAILURE:
            return { ...state, loadingPincodes: false, pincodeStatus: 'FAILURE', pincodeError: action.payload };

        case types.DELETE_PINCODE:
            return { ...state, loadingPincodes: true, pincodeStatus: types.DELETE_PINCODE, pincodeError: null };
        case types.DELETE_PINCODE_SUCCESS:
            return { ...state, loadingPincodes: false, pincodeStatus: types.DELETE_PINCODE_SUCCESS };
        case types.DELETE_PINCODE_FAILURE:
            return { ...state, loadingPincodes: false, pincodeStatus: 'FAILURE', pincodeError: action.payload };

        case types.UPDATE_PINCODE:
            return { ...state, loadingPincodes: true, pincodeStatus: types.UPDATE_PINCODE, pincodeError: null };
        case types.UPDATE_PINCODE_SUCCESS:
            return { ...state, loadingPincodes: false, pincodeStatus: types.UPDATE_PINCODE_SUCCESS };
        case types.UPDATE_PINCODE_FAILURE:
            return { ...state, loadingPincodes: false, pincodeStatus: 'FAILURE', pincodeError: action.payload };

        case types.GET_LOCATION_SUB_CATEGORIES:
            return { ...state, loadingSubCategories: true };
        case types.GET_LOCATION_SUB_CATEGORIES_SUCCESS:
            return { ...state, loadingSubCategories: false, subCategories: Array.isArray(action.payload) ? action.payload : [] };
        case types.GET_LOCATION_SUB_CATEGORIES_FAILURE:
            return { ...state, loadingSubCategories: false, subCategoryError: action.payload };

        case types.GET_LOCATION_CATEGORIES:
            return { ...state, loadingCategories: true };
        case types.GET_LOCATION_CATEGORIES_SUCCESS:
            return { ...state, loadingCategories: false, categories: Array.isArray(action.payload) ? action.payload : [] };
        case types.GET_LOCATION_CATEGORIES_FAILURE:
            return { ...state, loadingCategories: false, categoryError: action.payload };

        case types.GET_CATEGORY_LOCATION_LINKS:
            return { ...state, loadingCategoryLinks: true, linkError: null };
        case types.GET_CATEGORY_LOCATION_LINKS_SUCCESS:
            return {
                ...state,
                loadingCategoryLinks: false,
                categoryLocationLinks: Array.isArray(action.payload) ? action.payload : [],
            };
        case types.GET_CATEGORY_LOCATION_LINKS_FAILURE:
            return { ...state, loadingCategoryLinks: false, linkError: action.payload };

        case types.GET_SUB_CATEGORY_LOCATION_LINKS:
            return { ...state, loadingSubCategoryLinks: true, linkError: null };
        case types.GET_SUB_CATEGORY_LOCATION_LINKS_SUCCESS:
            return {
                ...state,
                loadingSubCategoryLinks: false,
                subCategoryLocationLinks: Array.isArray(action.payload) ? action.payload : [],
            };
        case types.GET_SUB_CATEGORY_LOCATION_LINKS_FAILURE:
            return { ...state, loadingSubCategoryLinks: false, linkError: action.payload };

        default:
            return state;
    }
};
