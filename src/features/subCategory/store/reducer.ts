import * as types from './action-types';

const initialState = {
    data: [],
    loading: false,
    error: null,
    status: 'IDLE',


    /** Images attached to the currently selected sub-category. */
    subCategoryMedia: [] as any[],
    /** Sub-category id `subCategoryMedia` belongs to (or is being fetched for). */
    subCategoryMediaFor: null as number | null,
    mediaLoading: false,
    /**
     * Media errors are kept out of `error` on purpose: the page toasts every change
     * of `error`, and the gallery already reports its own failures.
     */
    mediaError: null as string | null,
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


        // ── Sub-category media ───────────────────────────────────────────────
        // Media loading is tracked separately from `loading` so fetching a
        // sub-category's images never puts the sub-category list into its loading state.
        case types.GET_SUB_CATEGORY_MEDIA: {
            const requestedFor = action.meta?.subCategoryId ?? state.subCategoryMediaFor;
            const switching = requestedFor != null && requestedFor !== state.subCategoryMediaFor;
            return {
                ...state,
                mediaLoading: true,
                mediaError: null,
                subCategoryMediaFor: requestedFor,
                // Never show another sub-category's images while this one loads.
                subCategoryMedia: switching ? [] : state.subCategoryMedia,
            };
        }
        case types.GET_SUB_CATEGORY_MEDIA_SUCCESS: {
            const responseFor = action.meta?.subCategoryId;
            // Ignore a late response for a sub-category the user has already left.
            if (responseFor != null && state.subCategoryMediaFor != null && responseFor !== state.subCategoryMediaFor) {
                return state;
            }
            return { ...state, mediaLoading: false, subCategoryMedia: Array.isArray(action.payload) ? action.payload : [] };
        }

        case types.ATTACH_SUB_CATEGORY_MEDIA:
        case types.DETACH_SUB_CATEGORY_MEDIA:
        case types.UPDATE_SUB_CATEGORY_MEDIA:
        case types.TOGGLE_SUB_CATEGORY_MEDIA_ACTIVE:
        case types.SET_PRIMARY_SUB_CATEGORY_MEDIA:
        case types.UPLOAD_SUB_CATEGORY_MEDIA:
            return { ...state, mediaLoading: true, mediaError: null };

        case types.ATTACH_SUB_CATEGORY_MEDIA_SUCCESS:
        case types.DETACH_SUB_CATEGORY_MEDIA_SUCCESS:
        case types.UPDATE_SUB_CATEGORY_MEDIA_SUCCESS:
        case types.TOGGLE_SUB_CATEGORY_MEDIA_ACTIVE_SUCCESS:
        case types.UPLOAD_SUB_CATEGORY_MEDIA_SUCCESS:
            return { ...state, mediaLoading: false };

        case types.SET_PRIMARY_SUB_CATEGORY_MEDIA_SUCCESS: {
            const updated = action.payload;
            const list = Array.isArray(state.subCategoryMedia) ? state.subCategoryMedia : [];
            return {
                ...state,
                mediaLoading: false,
                subCategoryMedia: list.map((sm: any) => ({
                    ...sm,
                    isPrimary: updated?.mediaId != null ? sm.mediaId === updated.mediaId : sm.isPrimary,
                })),
            };
        }

        case types.GET_SUB_CATEGORY_MEDIA_FAILURE:
        case types.ATTACH_SUB_CATEGORY_MEDIA_FAILURE:
        case types.DETACH_SUB_CATEGORY_MEDIA_FAILURE:
        case types.UPDATE_SUB_CATEGORY_MEDIA_FAILURE:
        case types.TOGGLE_SUB_CATEGORY_MEDIA_ACTIVE_FAILURE:
        case types.SET_PRIMARY_SUB_CATEGORY_MEDIA_FAILURE:
        case types.UPLOAD_SUB_CATEGORY_MEDIA_FAILURE:
            return { ...state, mediaLoading: false, mediaError: action.payload };

        default:
            return state;
    }
};
