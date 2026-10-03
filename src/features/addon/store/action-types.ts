// Addon Action Types
export const GET_ADDON_DATA_REQUEST = 'GET_ADDON_DATA_REQUEST';
export const GET_ADDON_DATA_SUCCESS = 'GET_ADDON_DATA_SUCCESS';
export const GET_ADDON_DATA_FAILURE = 'GET_ADDON_DATA_FAILURE';

export const GET_ADDON_BY_ID_REQUEST = 'GET_ADDON_BY_ID_REQUEST';
export const GET_ADDON_BY_ID_SUCCESS = 'GET_ADDON_BY_ID_SUCCESS';
export const GET_ADDON_BY_ID_FAILURE = 'GET_ADDON_BY_ID_FAILURE';

export const ADD_ADDON_REQUEST = 'ADD_ADDON_REQUEST';
export const ADD_ADDON_SUCCESS = 'ADD_ADDON_SUCCESS';
export const ADD_ADDON_FAILURE = 'ADD_ADDON_FAILURE';

export const UPDATE_ADDON_REQUEST = 'UPDATE_ADDON_REQUEST';
export const UPDATE_ADDON_SUCCESS = 'UPDATE_ADDON_SUCCESS';
export const UPDATE_ADDON_FAILURE = 'UPDATE_ADDON_FAILURE';

export const DELETE_ADDON_REQUEST = 'DELETE_ADDON_REQUEST';
export const DELETE_ADDON_SUCCESS = 'DELETE_ADDON_SUCCESS';
export const DELETE_ADDON_FAILURE = 'DELETE_ADDON_FAILURE';

export const UPLOAD_ADDON_IMAGE_REQUEST = 'UPLOAD_ADDON_IMAGE_REQUEST';
export const UPLOAD_ADDON_IMAGE_SUCCESS = 'UPLOAD_ADDON_IMAGE_SUCCESS';
export const UPLOAD_ADDON_IMAGE_FAILURE = 'UPLOAD_ADDON_IMAGE_FAILURE';

export const REMOVE_ADDON_IMAGE_REQUEST = 'REMOVE_ADDON_IMAGE_REQUEST';
export const REMOVE_ADDON_IMAGE_SUCCESS = 'REMOVE_ADDON_IMAGE_SUCCESS';
export const REMOVE_ADDON_IMAGE_FAILURE = 'REMOVE_ADDON_IMAGE_FAILURE';

export const RESET_ADDON_STATUS = 'RESET_ADDON_STATUS';

export interface AddonType {
    id: number;
    name: string;
    description: string;
    icon: string;
    basePrice: number;
    isActive: boolean;
    /** Media record attached via POST /admin/addons/{id}/image/upload (null when none). */
    mediaId?: number | null;
    heroUrl?: string | null;
    thumbnailUrl?: string | null;
    originalUrl?: string | null;
}
