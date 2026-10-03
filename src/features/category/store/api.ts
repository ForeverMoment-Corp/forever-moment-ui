import axios from '@/utils/Http';

export const fetchCategoryData = async () => {
    return await axios.get('/admin/categories');
};

export const createCategoryApi = async (data: any) => {
    return await axios.post('/admin/categories', data);
};

export const deleteCategoryApi = async (id: number) => {
    return await axios.delete(`/admin/categories/${id}`);
};

export const updateCategoryApi = async (id: number, data: any) => {
    return await axios.put(`/admin/categories/${id}`, data);
};

export const reorderCategoryApi = async (data: { id: number; newPosition: number }) => {
    return await axios.patch('/admin/categories/reorder', data);
};

export const associateCategoryWithLocationApi = async (locationId: number, categoryId: number, payload: any) => {
    return await axios.post(`/admin/locations/${locationId}/categories/${categoryId}`, payload);
};

export const disassociateCategoryFromLocationApi = async (locationId: number, categoryId: number) => {
    return await axios.delete(`/admin/locations/${locationId}/categories/${categoryId}`);
};

// ── Category media (/admin/categories/{id}/media) ────────────────────────────
// Same contract as the experience media endpoints; responses are ExperienceMediaResponseDto rows.

export const fetchCategoryMediaApi = async (categoryId: number) => {
    return await axios.get(`/admin/categories/${categoryId}/media`);
};

export const fetchCategoryPrimaryMediaApi = async (categoryId: number) => {
    return await axios.get(`/admin/categories/${categoryId}/media/primary`);
};

export const attachCategoryMediaApi = async (categoryId: number, mediaId: number, data: any) => {
    return await axios.post(`/admin/categories/${categoryId}/media/${mediaId}`, data);
};

export const updateCategoryMediaApi = async (categoryId: number, mediaId: number, data: any) => {
    return await axios.put(`/admin/categories/${categoryId}/media/${mediaId}`, data);
};

export const detachCategoryMediaApi = async (categoryId: number, mediaId: number) => {
    return await axios.delete(`/admin/categories/${categoryId}/media/${mediaId}`);
};

export const toggleCategoryMediaActiveApi = async (categoryId: number, mapperId: number) => {
    return await axios.patch(`/admin/categories/${categoryId}/media/${mapperId}/toggle`);
};

/**
 * POST /admin/categories/{categoryId}/media/upload — multipart upload that stores the image
 * and attaches it to the category in one call. The file goes under the `file` field, the
 * attachment options (displayOrder, isPrimary, altText, isActive) under a JSON `attach` part,
 * and any extra storage metadata is read from request params.
 */
export const uploadCategoryMediaApi = async (
    categoryId: number,
    file: File,
    attach: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean } = {},
    metadata: Record<string, any> = {}
) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('attach', new Blob([JSON.stringify(attach)], { type: 'application/json' }));

    return await axios.post(`/admin/categories/${categoryId}/media/upload`, formData, {
        params: metadata,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
