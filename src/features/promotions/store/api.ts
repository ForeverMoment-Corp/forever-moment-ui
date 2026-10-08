import axios from '@/utils/Http';

export const fetchPromotions = async () => {
    return await axios.get('/admin/coupons');
};

export const createPromotion = async (data: any) => {
    return await axios.post('/admin/coupons', data);
};

export const updatePromotion = async (id: number | string, data: any) => {
    return await axios.put(`/admin/coupons/${id}`, data);
};

export const deletePromotion = async (id: number | string) => {
    return await axios.delete(`/admin/coupons/${id}`);
};
