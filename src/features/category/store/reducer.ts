import * as types from './action-types';

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: 'IDLE',

    /** Images attached to the currently selected category. */
    categoryMedia: [] as any[],
    /** Category id `categoryMedia` belongs to (or is being fetched for). */
    categoryMediaFor: null as number | null,
    mediaLoading: false,
    /**
     * Media errors are kept out of `error` on purpose: the page toasts every change
     * of `error`, and the gallery already reports its own failures.
     */
    mediaError: null as string | null,
};

export const categoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_CATEGORY_DATA:
            return { ...state, loading: true };
        case types.GET_CATEGORY_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_CATEGORY_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_CATEGORY:
            return { ...state, loading: true, status: types.CREATE_CATEGORY, error: null };
        case types.CREATE_CATEGORY_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_CATEGORY_SUCCESS }; // Data might be refreshed by getCategoryData
        case types.CREATE_CATEGORY_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_CATEGORY:
            return { ...state, loading: true, status: types.DELETE_CATEGORY, error: null };
        case types.DELETE_CATEGORY_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_CATEGORY_SUCCESS };
        case types.DELETE_CATEGORY_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_CATEGORY:
            return { ...state, loading: true, status: types.UPDATE_CATEGORY, error: null };
        case types.UPDATE_CATEGORY_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_CATEGORY_SUCCESS };
        case types.UPDATE_CATEGORY_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.REORDER_CATEGORY:
            return { ...state, error: null };
        case types.REORDER_CATEGORY_SUCCESS:
            return { ...state, loading: false };
        case types.REORDER_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null };

        case types.ASSOCIATE_LOCATION:
        case types.DISASSOCIATE_LOCATION:
            return { ...state, loading: true, error: null };
            
        case types.ASSOCIATE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.ASSOCIATE_LOCATION_SUCCESS };
            
        case types.DISASSOCIATE_LOCATION_SUCCESS:
            return { ...state, loading: false, status: types.DISASSOCIATE_LOCATION_SUCCESS };

        case types.ASSOCIATE_LOCATION_FAILURE:
        case types.DISASSOCIATE_LOCATION_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        // ── Category media ───────────────────────────────────────────────────
        // Media loading is tracked separately from `loading` so fetching a
        // category's images never puts the category list into its loading state.
        case types.GET_CATEGORY_MEDIA: {
            const requestedFor = action.meta?.categoryId ?? state.categoryMediaFor;
            const switching = requestedFor != null && requestedFor !== state.categoryMediaFor;
            return {
                ...state,
                mediaLoading: true,
                mediaError: null,
                categoryMediaFor: requestedFor,
                // Never show another category's images while this one loads.
                categoryMedia: switching ? [] : state.categoryMedia,
            };
        }
        case types.GET_CATEGORY_MEDIA_SUCCESS: {
            const responseFor = action.meta?.categoryId;
            // Ignore a late response for a category the user has already left.
            if (responseFor != null && state.categoryMediaFor != null && responseFor !== state.categoryMediaFor) {
                return state;
            }
            return { ...state, mediaLoading: false, categoryMedia: Array.isArray(action.payload) ? action.payload : [] };
        }

        case types.ATTACH_CATEGORY_MEDIA:
        case types.DETACH_CATEGORY_MEDIA:
        case types.UPDATE_CATEGORY_MEDIA:
        case types.TOGGLE_CATEGORY_MEDIA_ACTIVE:
        case types.SET_PRIMARY_CATEGORY_MEDIA:
        case types.UPLOAD_CATEGORY_MEDIA:
            return { ...state, mediaLoading: true, mediaError: null };

        case types.ATTACH_CATEGORY_MEDIA_SUCCESS:
        case types.DETACH_CATEGORY_MEDIA_SUCCESS:
        case types.UPDATE_CATEGORY_MEDIA_SUCCESS:
        case types.TOGGLE_CATEGORY_MEDIA_ACTIVE_SUCCESS:
        case types.UPLOAD_CATEGORY_MEDIA_SUCCESS:
            return { ...state, mediaLoading: false };

        case types.SET_PRIMARY_CATEGORY_MEDIA_SUCCESS: {
            const updated = action.payload;
            const list = Array.isArray(state.categoryMedia) ? state.categoryMedia : [];
            return {
                ...state,
                mediaLoading: false,
                categoryMedia: list.map((cm: any) => ({
                    ...cm,
                    isPrimary: updated?.mediaId != null ? cm.mediaId === updated.mediaId : cm.isPrimary,
                })),
            };
        }

        case types.GET_CATEGORY_MEDIA_FAILURE:
        case types.ATTACH_CATEGORY_MEDIA_FAILURE:
        case types.DETACH_CATEGORY_MEDIA_FAILURE:
        case types.UPDATE_CATEGORY_MEDIA_FAILURE:
        case types.TOGGLE_CATEGORY_MEDIA_ACTIVE_FAILURE:
        case types.SET_PRIMARY_CATEGORY_MEDIA_FAILURE:
        case types.UPLOAD_CATEGORY_MEDIA_FAILURE:
            return { ...state, mediaLoading: false, mediaError: action.payload };

        default:
            return state;
    }
};
