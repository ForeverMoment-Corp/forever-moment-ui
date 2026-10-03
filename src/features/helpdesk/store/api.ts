import axios from '@/utils/Http';

export type SupportQueryStatus = 'OPEN' | 'RESOLVED';

/** Shape of SupportQueryResponseDto returned by /admin/support */
export interface SupportQuery {
    id: number;
    referenceId: string;
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
    status: SupportQueryStatus;
    createdOn: string | number;
    resolvedOn?: string | number | null;
}

/** Newest first. Omit status to get both OPEN and RESOLVED queries. */
export const fetchSupportQueries = async (status?: SupportQueryStatus) => {
    return await axios.get('/admin/support', { params: status ? { status } : undefined });
};

export const resolveSupportQueryApi = async (id: number) => {
    return await axios.patch(`/admin/support/${id}/resolve`);
};
