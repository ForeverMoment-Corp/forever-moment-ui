import axios from '@/utils/Http';

const basePath = '/admin/addons';

export const getAddonDataApi = async () => {
    return await axios.get(basePath);
};

export const createAddonApi = async (data: any) => {
    return await axios.post(basePath, data);
};

export const updateAddonApi = async (id: number, data: any) => {
    return await axios.put(`${basePath}/${id}`, data);
};

export const deleteAddonApi = async (id: number) => {
    return await axios.delete(`${basePath}/${id}`);
};

/**
 * POST /admin/addons/{id}/image/upload — multipart upload that stores the image and
 * attaches it to the add-on in one call. The backend expects the file under the `file` field;
 * any extra metadata (e.g. altText) is read from request params.
 */
export const uploadAddonImageApi = async (id: number, file: File, metadata: Record<string, any> = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    return await axios.post(`${basePath}/${id}/image/upload`, formData, {
        params: metadata,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
