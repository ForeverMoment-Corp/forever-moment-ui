import Http from '@/utils/Http';

export const getSubCategories = async () => {
    return await Http.get('/admin/subcategories');
};

export const createSubCategory = async (payload: any) => {
    return await Http.post('/admin/subcategories/category', payload);
};

export const updateSubCategory = async (id: number, payload: any) => {
    return await Http.put(`/admin/subcategories/${id}`, payload);
};

export const deleteSubCategory = async (id: number) => {
    return await Http.delete(`/admin/subcategories/${id}`);
};

export const associateSubCategoryWithLocationApi = async (locationId: number, subCategoryId: number, payload: any) => {
    return await Http.post(`/admin/locations/${locationId}/subcategories/${subCategoryId}`, payload);
};

export const disassociateSubCategoryFromLocationApi = async (locationId: number, subCategoryId: number) => {
    return await Http.delete(`/admin/locations/${locationId}/subcategories/${subCategoryId}`);
};


// ── Sub-category media (/admin/subcategories/{id}/media) ─────────────────────
// Same contract as the experience media endpoints; responses are ExperienceMediaResponseDto rows.

export const fetchSubCategoryMediaApi = async (subCategoryId: number) => {
    return await Http.get(`/admin/subcategories/${subCategoryId}/media`);
};

export const fetchSubCategoryPrimaryMediaApi = async (subCategoryId: number) => {
    return await Http.get(`/admin/subcategories/${subCategoryId}/media/primary`);
};

export const attachSubCategoryMediaApi = async (subCategoryId: number, mediaId: number, data: any) => {
    return await Http.post(`/admin/subcategories/${subCategoryId}/media/${mediaId}`, data);
};

export const updateSubCategoryMediaApi = async (subCategoryId: number, mediaId: number, data: any) => {
    return await Http.put(`/admin/subcategories/${subCategoryId}/media/${mediaId}`, data);
};

export const detachSubCategoryMediaApi = async (subCategoryId: number, mediaId: number) => {
    return await Http.delete(`/admin/subcategories/${subCategoryId}/media/${mediaId}`);
};

export const toggleSubCategoryMediaActiveApi = async (subCategoryId: number, mapperId: number) => {
    return await Http.patch(`/admin/subcategories/${subCategoryId}/media/${mapperId}/toggle`);
};

/**
 * POST /admin/subcategories/{subCategoryId}/media/upload — multipart upload that stores the
 * image and attaches it to the sub-category in one call. The file goes under the `file` field,
 * the attachment options (displayOrder, isPrimary, altText, isActive) under a JSON `attach`
 * part, and any extra storage metadata is read from request params.
 */
export const uploadSubCategoryMediaApi = async (
    subCategoryId: number,
    file: File,
    attach: { displayOrder?: number; isPrimary?: boolean; altText?: string; isActive?: boolean } = {},
    metadata: Record<string, any> = {}
) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('attach', new Blob([JSON.stringify(attach)], { type: 'application/json' }));

    return await Http.post(`/admin/subcategories/${subCategoryId}/media/upload`, formData, {
        params: metadata,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
