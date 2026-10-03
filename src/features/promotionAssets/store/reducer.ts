import * as types from './action-types';

interface PromotionAssetState {
    data: types.PromotionAssetType[] | null;
    loading: boolean;
    error: string | null;
    status: string;
}

const initialState: PromotionAssetState = {
    data: null,
    loading: false,
    error: null,
    status: '',
};

export const promotionAssetReducer = (state = initialState, action: any): PromotionAssetState => {
    switch (action.type) {
        // Fetch all
        case types.GET_PROMOTION_ASSETS_REQUEST:
            return { ...state, loading: true, error: null };
        case types.GET_PROMOTION_ASSETS_SUCCESS:
            return { ...state, loading: false, data: Array.isArray(action.payload) ? action.payload : [] };
        case types.GET_PROMOTION_ASSETS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Create / Update / Delete share the same shape
        case types.ADD_PROMOTION_ASSET_REQUEST:
        case types.UPDATE_PROMOTION_ASSET_REQUEST:
        case types.DELETE_PROMOTION_ASSET_REQUEST:
            return { ...state, loading: true, error: null, status: action.type };

        case types.UPDATE_PROMOTION_ASSET_SUCCESS: {
            const updated = action.payload;
            const list = Array.isArray(state.data) ? state.data : null;
            return {
                ...state,
                loading: false,
                status: action.type,
                // Patch the row in place so the UI reflects the change before the refetch lands.
                data: list && updated?.id != null
                    ? list.map((a) => (String(a.id) === String(updated.id) ? { ...a, ...updated } : a))
                    : list,
            };
        }
        case types.ADD_PROMOTION_ASSET_SUCCESS:
        case types.DELETE_PROMOTION_ASSET_SUCCESS:
            return { ...state, loading: false, status: action.type };

        case types.ADD_PROMOTION_ASSET_FAILURE:
        case types.UPDATE_PROMOTION_ASSET_FAILURE:
        case types.DELETE_PROMOTION_ASSET_FAILURE:
            return { ...state, loading: false, error: action.payload, status: action.type };

        case types.RESET_PROMOTION_ASSET_STATUS:
            return { ...state, status: '', error: null };

        default:
            return state;
    }
};
