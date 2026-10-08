import * as types from './action-types';

const initialState = {
    data: null,
    selectedExperienceDetail: null,
    loading: false,
    error: null,
    status: 'IDLE',
    experienceMedia: [],
    /** Experience id the current `experienceMedia` list belongs to (or is being fetched for). */
    experienceMediaFor: null as number | null,
    primaryMedia: null,
    experienceAddons: [],
    addonsLoading: false,
    experiencePromotions: [],
    promotionsLoading: false,
};

export const experienceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.GET_EXPERIENCE_DATA:
            return { ...state, loading: true };
        case types.GET_EXPERIENCE_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case types.GET_EXPERIENCE_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.GET_EXPERIENCE_BY_ID:
            return { ...state, loading: true, error: null };
        case types.GET_EXPERIENCE_BY_ID_SUCCESS:
            return { ...state, loading: false, selectedExperienceDetail: action.payload };
        case types.GET_EXPERIENCE_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_EXPERIENCE:
            return { ...state, loading: true, status: types.CREATE_EXPERIENCE, error: null };
        case types.CREATE_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, status: types.CREATE_EXPERIENCE_SUCCESS };
        case types.CREATE_EXPERIENCE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.DELETE_EXPERIENCE:
            return { ...state, loading: true, status: types.DELETE_EXPERIENCE, error: null };
        case types.DELETE_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, status: types.DELETE_EXPERIENCE_SUCCESS };
        case types.DELETE_EXPERIENCE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.UPDATE_EXPERIENCE:
            return { ...state, loading: true, status: types.UPDATE_EXPERIENCE, error: null };
        case types.UPDATE_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, status: types.UPDATE_EXPERIENCE_SUCCESS };
        case types.UPDATE_EXPERIENCE_FAILURE:
            return { ...state, loading: false, status: 'FAILURE', error: action.payload };

        case types.REORDER_EXPERIENCE:
            return { ...state, error: null };
        case types.REORDER_EXPERIENCE_SUCCESS:
            return { ...state, loading: false };
        case types.REORDER_EXPERIENCE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.TOGGLE_CANCELLATION_POLICY:
            return { ...state, loading: true, error: null };
        case types.TOGGLE_CANCELLATION_POLICY_SUCCESS:
            return { ...state, loading: false };
        case types.TOGGLE_CANCELLATION_POLICY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.TOGGLE_INCLUSION:
            return { ...state, loading: true, error: null };
        case types.TOGGLE_INCLUSION_SUCCESS:
            return { ...state, loading: false };
        case types.TOGGLE_INCLUSION_FAILURE:
            return { ...state, loading: false, error: action.payload };
        
        case types.TOGGLE_EXPERIENCE_LOCATION:
            return { ...state, loading: true, error: null };
        case types.TOGGLE_EXPERIENCE_LOCATION_SUCCESS:
            return { ...state, loading: false };
        case types.TOGGLE_EXPERIENCE_LOCATION_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.TOGGLE_EXPERIENCE_ACTIVE:
            return { ...state, status: types.TOGGLE_EXPERIENCE_ACTIVE, error: null };
        case types.TOGGLE_EXPERIENCE_ACTIVE_SUCCESS:
            return { ...state, status: types.TOGGLE_EXPERIENCE_ACTIVE_SUCCESS };
        case types.TOGGLE_EXPERIENCE_ACTIVE_FAILURE:
            return { ...state, status: 'FAILURE', error: action.payload };

        case types.TOGGLE_EXPERIENCE_FEATURED:
            return { ...state, status: types.TOGGLE_EXPERIENCE_FEATURED, error: null };
        case types.TOGGLE_EXPERIENCE_FEATURED_SUCCESS:
            return { ...state, status: types.TOGGLE_EXPERIENCE_FEATURED_SUCCESS };
        case types.TOGGLE_EXPERIENCE_FEATURED_FAILURE:
            return { ...state, status: 'FAILURE', error: action.payload };

        case types.RESET_STATUS:
            return { ...state, status: 'IDLE', error: null, selectedExperienceDetail: null };

        case types.GET_EXPERIENCE_ADDONS:
            return { ...state, addonsLoading: true, error: null };
        case types.GET_EXPERIENCE_ADDONS_SUCCESS:
            return { ...state, addonsLoading: false, experienceAddons: Array.isArray(action.payload) ? action.payload : [] };
        case types.GET_EXPERIENCE_ADDONS_FAILURE:
            return { ...state, addonsLoading: false, error: action.payload };

        case types.GET_EXPERIENCE_PROMOTIONS:
            return { ...state, promotionsLoading: true, error: null };
        case types.GET_EXPERIENCE_PROMOTIONS_SUCCESS:
            return { ...state, promotionsLoading: false, experiencePromotions: Array.isArray(action.payload) ? action.payload : [] };
        case types.GET_EXPERIENCE_PROMOTIONS_FAILURE:
            return { ...state, promotionsLoading: false, error: action.payload };

        case types.TOGGLE_PROMOTION:
            return { ...state, loading: true, error: null };
        case types.TOGGLE_PROMOTION_SUCCESS:
            return { ...state, loading: false };
        case types.TOGGLE_PROMOTION_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.GET_EXPERIENCE_MEDIA: {
            const requestedFor = action.meta?.experienceId ?? state.experienceMediaFor;
            const switching = requestedFor != null && requestedFor !== state.experienceMediaFor;
            return {
                ...state,
                loading: true,
                error: null,
                experienceMediaFor: requestedFor,
                // Never show another experience's images while this one loads.
                experienceMedia: switching ? [] : state.experienceMedia,
            };
        }
        case types.BULK_ATTACH_MEDIA:
        case types.DISASSOCIATE_MEDIA:
        case types.ATTACH_MEDIA:
        case types.UPDATE_MEDIA_ATTACHMENT:
        case types.TOGGLE_MEDIA_ACTIVE:
        case types.GET_PRIMARY_MEDIA:
        case types.SET_PRIMARY_MEDIA:
        case types.UPLOAD_EXPERIENCE_MEDIA:
            return { ...state, loading: true, error: null };
        case types.UPLOAD_EXPERIENCE_MEDIA_SUCCESS:
        case types.BULK_ATTACH_MEDIA_SUCCESS:
        case types.DISASSOCIATE_MEDIA_SUCCESS:
        case types.ATTACH_MEDIA_SUCCESS:
        case types.UPDATE_MEDIA_ATTACHMENT_SUCCESS:
        case types.TOGGLE_MEDIA_ACTIVE_SUCCESS:
            return { ...state, loading: false };
        case types.GET_EXPERIENCE_MEDIA_SUCCESS: {
            const responseFor = action.meta?.experienceId;
            // Ignore a late response for an experience the user has already left.
            if (responseFor != null && state.experienceMediaFor != null && responseFor !== state.experienceMediaFor) {
                return state;
            }
            return { ...state, loading: false, experienceMedia: Array.isArray(action.payload) ? action.payload : [] };
        }
        case types.GET_PRIMARY_MEDIA_SUCCESS:
            return { ...state, loading: false, primaryMedia: action.payload };
        case types.SET_PRIMARY_MEDIA_SUCCESS: {
            const updated = action.payload;
            const list = Array.isArray(state.experienceMedia) ? state.experienceMedia : [];
            return {
                ...state,
                loading: false,
                primaryMedia: updated,
                experienceMedia: list.map((em: any) => ({
                    ...em,
                    isPrimary: updated?.mediaId != null ? em.mediaId === updated.mediaId : em.isPrimary,
                })),
            };
        }
        case types.BULK_ATTACH_MEDIA_FAILURE:
        case types.DISASSOCIATE_MEDIA_FAILURE:
        case types.GET_EXPERIENCE_MEDIA_FAILURE:
        case types.ATTACH_MEDIA_FAILURE:
        case types.UPDATE_MEDIA_ATTACHMENT_FAILURE:
        case types.TOGGLE_MEDIA_ACTIVE_FAILURE:
        case types.GET_PRIMARY_MEDIA_FAILURE:
        case types.SET_PRIMARY_MEDIA_FAILURE:
        case types.UPLOAD_EXPERIENCE_MEDIA_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
