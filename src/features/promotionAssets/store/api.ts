import axios from '@/utils/Http';
import type { PromotionAssetFilters, PromotionAssetPayload } from './action-types';

const basePath = '/admin/promotions/assets';

/** GET /admin/promotions/assets?key=&placement=&isActive= */
export const getPromotionAssetsApi = async (filters: PromotionAssetFilters = {}) => {
    const params: Record<string, string | boolean> = {};
    if (filters.key) params.key = filters.key;
    if (filters.placement) params.placement = filters.placement;
    if (typeof filters.isActive === 'boolean') params.isActive = filters.isActive;
    return await axios.get(basePath, { params });
};

/** POST /admin/promotions/assets */
export const createPromotionAssetApi = async (data: PromotionAssetPayload) => {
    return await axios.post(basePath, data);
};

/** PUT /admin/promotions/assets/{id} */
export const updatePromotionAssetApi = async (id: number, data: PromotionAssetPayload) => {
    return await axios.put(`${basePath}/${id}`, data);
};

/** DELETE /admin/promotions/assets/{id} (soft delete on the backend) */
export const deletePromotionAssetApi = async (id: number) => {
    return await axios.delete(`${basePath}/${id}`);
};
