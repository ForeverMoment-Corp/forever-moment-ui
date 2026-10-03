// Promotion Asset Action Types
export const GET_PROMOTION_ASSETS_REQUEST = 'GET_PROMOTION_ASSETS_REQUEST';
export const GET_PROMOTION_ASSETS_SUCCESS = 'GET_PROMOTION_ASSETS_SUCCESS';
export const GET_PROMOTION_ASSETS_FAILURE = 'GET_PROMOTION_ASSETS_FAILURE';

export const ADD_PROMOTION_ASSET_REQUEST = 'ADD_PROMOTION_ASSET_REQUEST';
export const ADD_PROMOTION_ASSET_SUCCESS = 'ADD_PROMOTION_ASSET_SUCCESS';
export const ADD_PROMOTION_ASSET_FAILURE = 'ADD_PROMOTION_ASSET_FAILURE';

export const UPDATE_PROMOTION_ASSET_REQUEST = 'UPDATE_PROMOTION_ASSET_REQUEST';
export const UPDATE_PROMOTION_ASSET_SUCCESS = 'UPDATE_PROMOTION_ASSET_SUCCESS';
export const UPDATE_PROMOTION_ASSET_FAILURE = 'UPDATE_PROMOTION_ASSET_FAILURE';

export const DELETE_PROMOTION_ASSET_REQUEST = 'DELETE_PROMOTION_ASSET_REQUEST';
export const DELETE_PROMOTION_ASSET_SUCCESS = 'DELETE_PROMOTION_ASSET_SUCCESS';
export const DELETE_PROMOTION_ASSET_FAILURE = 'DELETE_PROMOTION_ASSET_FAILURE';

export const RESET_PROMOTION_ASSET_STATUS = 'RESET_PROMOTION_ASSET_STATUS';

/** Row returned by GET /admin/promotions/assets (PromotionImageResponseDto). */
export interface PromotionAssetType {
    id: number;
    mediaId: number;
    promoKey: string;
    placement: string;
    /** LocalDateTime without zone, e.g. "2026-10-02T10:00:00". Null means "no lower bound". */
    startAt?: string | null;
    /** LocalDateTime without zone. Null means "no upper bound". */
    endAt?: string | null;
    priority: number;
    isActive: boolean;
    title?: string | null;
    altTextOverride?: string | null;
    fileName?: string | null;
    storageFileName?: string | null;
    url?: string | null;
    heroUrl?: string | null;
    thumbnailUrl?: string | null;
    originalUrl?: string | null;
}

/** Body for POST / PUT /admin/promotions/assets (PromotionAssetRequestDto). */
export interface PromotionAssetPayload {
    /** Required by the backend; PUT re-resolves the bound media from this on every call. */
    mediaId: number | null;
    promoKey: string;
    placement: string;
    startAt?: string | null;
    endAt?: string | null;
    priority: number;
    isActive: boolean;
    title?: string | null;
    altTextOverride?: string | null;
}

/** Optional server-side filters supported by the list endpoint. */
export interface PromotionAssetFilters {
    key?: string;
    placement?: string;
    isActive?: boolean;
}
