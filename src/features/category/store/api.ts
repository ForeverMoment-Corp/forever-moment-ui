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
