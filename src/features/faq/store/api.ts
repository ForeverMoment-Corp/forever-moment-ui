import axios from '@/utils/Http';

/**
 * Body accepted by POST/PUT /admin/faqs. The backend rejects unknown fields,
 * and a PUT without isActive resets the FAQ to active, so always send it.
 */
export interface FaqPayload {
    question: string;
    answer: string;
    isActive: boolean;
    displayOrder?: number;
}

export const fetchFaqData = async () => {
    return await axios.get('/admin/faqs');
};

export const createFaqApi = async (data: FaqPayload) => {
    return await axios.post('/admin/faqs', data);
};

export const updateFaqApi = async (id: number, data: FaqPayload) => {
    return await axios.put(`/admin/faqs/${id}`, data);
};

export const deleteFaqApi = async (id: number) => {
    return await axios.delete(`/admin/faqs/${id}`);
};

export const toggleFaqApi = async (id: number) => {
    return await axios.patch(`/admin/faqs/${id}/toggle`);
};

/** Resequences display order to match the given ids (every FAQ id, in order). */
export const reorderFaqApi = async (orderedIds: number[]) => {
    return await axios.put('/admin/faqs/reorder', orderedIds);
};
