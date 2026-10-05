import axios from '@/utils/Http';

export const fetchVendorsApi = async () => {
    return await axios.get('/admin/vendors');
};

export const createVendorApi = async (data: any) => {
    return await axios.post('/admin/vendors', data);
};

export const updateVendorApi = async (id: number, data: any) => {
    return await axios.put(`/admin/vendors/${id}`, data);
};

export const deleteVendorApi = async (id: number) => {
    return await axios.delete(`/admin/vendors/${id}`);
};
