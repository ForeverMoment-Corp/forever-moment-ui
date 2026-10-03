import axios from '@/utils/Http';
import { getLoginSession } from '@/utils/storage';

export const fetchImagesApi = async () => {
    return await axios.get('/admin/images');
};

export const getImageUrl = (id: string) => {
    const rawBase = axios.defaults.baseURL || '';
    const cleanBase = rawBase.replace(/\/+$/, '');
    const url = `${cleanBase}/admin/images/${id}`;
    const token = getLoginSession("access_token");
    return token ? `${url}?accessToken=${token}` : url;
};

const getApiOrigin = () => {
    const rawBase = axios.defaults.baseURL || '';
    if (/^https?:\/\//.test(rawBase)) {
        try {
            return new URL(rawBase).origin;
        } catch {
            /* fall through to window origin */
        }
    }
    return window.location.origin;
};

// Encode a path once (spaces etc.) without double-encoding already-encoded input.
const encodePath = (path: string) => {
    try {
        return encodeURI(decodeURI(path));
    } catch {
        return encodeURI(path);
    }
};

export const isPublicMediaPath = (path: string) => /\/public\//.test(path || '');

/**
 * Resolve a media path returned by the API (e.g. `/api/platform/public/images/fetch/x.png`)
 * into a URL the browser can load.
 *
 * Server-rooted paths (starting with "/") already contain the API context path, so they are
 * resolved against the API *origin* only - never appended to `baseURL` again. Relative paths
 * are appended to `baseURL`. Public paths are returned without an access token.
 */
export const getMediaAssetUrl = (path?: string | null) => {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }

    let url: string;
    if (path.startsWith('/')) {
        url = `${getApiOrigin()}${encodePath(path)}`;
    } else {
        const cleanBase = (axios.defaults.baseURL || '').replace(/\/+$/, '');
        url = `${cleanBase}/${encodePath(path)}`;
    }

    if (isPublicMediaPath(path)) return url;

    const token = getLoginSession("access_token");
    if (!token) return url;
    return `${url}${url.includes('?') ? '&' : '?'}accessToken=${token}`;
};

/** Thumbnail / preview / original URLs for an image record, with sensible fallbacks. */
export const getImageSources = (img: any) => {
    if (!img) return { thumbnail: '', preview: '', original: '' };
    return {
        thumbnail: getMediaAssetUrl(img.thumbnailUrl || img.mediaUrl || img.url),
        preview: getMediaAssetUrl(img.mediaUrl || img.url || img.originalUrl),
        original: getMediaAssetUrl(img.originalUrl || img.mediaUrl || img.url),
    };
};

/** Download a public media URL as a blob (no auth headers needed for public assets). */
export const downloadMediaAssetApi = async (path: string) => {
    const res = await fetch(getMediaAssetUrl(path));
    if (!res.ok) throw new Error(`Failed to download media (${res.status})`);
    return res.blob();
};

export const uploadImageApi = async (files: File[], metadata: any = {}) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const metadataStr = JSON.stringify(metadata);

    return await axios.post('/admin/images/batch', formData, {
        params: { metadata: metadataStr },
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteImageApi = async (id: string) => {
    return await axios.delete(`/admin/images/${id}`);
};

export const downloadImageApi = async (id: string) => {
    return await axios.get(`/admin/images/${id}`, { responseType: 'blob' });
};

export const fetchImageMetadataApi = async (id: string) => {
    return await axios.get(`/admin/images/${id}/metadata`);
};

export const fetchImageByStorageNameApi = async (storageFileName: string) => {
    return await axios.get(`/admin/images/fetch/${storageFileName}`, { responseType: 'blob' });
};

export const getImageByStorageNameUrl = (storageFileName: string) => {
    if (!storageFileName) return '';
    const rawBase = axios.defaults.baseURL || '';
    const cleanBase = rawBase.replace(/\/+$/, '');
    const url = `${cleanBase}/admin/images/fetch/${encodeURIComponent(storageFileName)}`;
    const token = getLoginSession('access_token');
    return token ? `${url}?accessToken=${token}` : url;
};
