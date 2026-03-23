import axios from '@/utils/Http';

export const fetchExperienceData = async () => {
    return await axios.get('/admin/experiences');
};

export const fetchExperienceByIdApi = async (id: number) => {
    return await axios.get(`/admin/experiences/${id}`);
};

export const createExperienceApi = async (data: any) => {
    return await axios.post('/admin/experiences', data);
};

export const deleteExperienceApi = async (id: number) => {
    return await axios.delete(`/admin/experiences/${id}`);
};

export const updateExperienceApi = async (id: number, data: any) => {
    return await axios.put(`/admin/experiences/${id}`, data);
};

export const reorderExperienceApi = async (data: { id: number; newPosition: number }) => {
    return await axios.patch('/admin/experiences/reorder', data);
};

export const associateCancellationPolicyApi = async (experienceId: number, policyId: number) => {
    return await axios.post(`/admin/experiences/${experienceId}/cancellation-policies/${policyId}`, {});
};

export const disassociateCancellationPolicyApi = async (experienceId: number, policyId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/cancellation-policies/${policyId}`);
};

export const associateInclusionApi = async (experienceId: number, inclusionId: number) => {
    return await axios.post(`/admin/experiences/${experienceId}/inclusions/${inclusionId}`, {});
};

export const disassociateInclusionApi = async (experienceId: number, inclusionId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/inclusions/${inclusionId}`);
};

export const associateLocationApi = async (experienceId: number, locationId: number, data: any) => {
    return await axios.post(`/admin/locations/${locationId}/experiences/${experienceId}`, data);
};

export const updateExperienceLocationApi = async (experienceId: number, locationId: number, data: any) => {
    return await axios.put(`/admin/locations/${locationId}/experiences/${experienceId}`, data);
};

export const disassociateLocationApi = async (experienceId: number, locationId: number) => {
    return await axios.delete(`/admin/locations/${locationId}/experiences/${experienceId}`);
};

export const toggleExperienceLocationApi = async (locationId: number, mapperId: number) =>
    await axios.patch(`/admin/locations/${locationId}/experiences/${mapperId}/toggle`);

export const associateLocationTimeSlotApi = async (experienceId: number, locationId: number, timeSlotId: number, data: any) => {
    return await axios.post(`/admin/experiences/${experienceId}/locations/${locationId}/timeslots/${timeSlotId}`, data);
};

export const updateLocationTimeSlotApi = async (experienceId: number, locationId: number, timeSlotId: number, data: any) => {
    return await axios.put(`/admin/experiences/${experienceId}/locations/${locationId}/timeslots/${timeSlotId}`, data);
};

export const bulkAttachLocationTimeSlotsApi = async (experienceId: number, locationId: number, data: any) => {
    return await axios.post(`/admin/experiences/${experienceId}/locations/${locationId}/timeslots/bulk-attach`, data);
};

export const toggleLocationTimeSlotApi = async (experienceId: number, locationId: number, mapperId: number) => {
    return await axios.patch(`/admin/experiences/${experienceId}/locations/${locationId}/timeslots/${mapperId}/toggle`);
};

export const disassociateLocationTimeSlotApi = async (experienceId: number, locationId: number, timeSlotId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/locations/${locationId}/timeslots/${timeSlotId}`);
};

export const associateAddonApi = async (experienceId: number, addonId: number, data: any) => {
    return await axios.post(`/admin/experiences/${experienceId}/addons/${addonId}`, {}, { params: data });
};

export const disassociateAddonApi = async (experienceId: number, addonId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/addons/${addonId}`);
};

export const toggleExperienceActiveApi = async (id: number) => {
    return await axios.patch(`/admin/experiences/${id}/toggle-active`);
};

export const toggleExperienceFeaturedApi = async (id: number) => {
    return await axios.patch(`/admin/experiences/${id}/toggle-featured`);
};

export const bulkAttachExperienceMediaApi = async (experienceId: number, data: { items: any[] }) => {
    return await axios.post(`/admin/experiences/${experienceId}/media/bulk-attach`, data);
};

export const disassociateExperienceMediaApi = async (experienceId: number, mediaId: number) => {
    return await axios.delete(`/admin/experiences/${experienceId}/media/${mediaId}`);
};

export const fetchExperienceMediaApi = async (experienceId: number) => {
    return await axios.get(`/admin/experiences/${experienceId}/media`);
};

export const attachExperienceMediaApi = async (experienceId: number, mediaId: number, data: any) => {
    return await axios.post(`/admin/experiences/${experienceId}/media/${mediaId}`, data);
};

export const updateExperienceMediaApi = async (experienceId: number, mediaId: number, data: any) => {
    return await axios.put(`/admin/experiences/${experienceId}/media/${mediaId}`, data);
};

export const toggleExperienceMediaActiveApi = async (mapperId: number) => {
    return await axios.patch(`/admin/experiences/media/${mapperId}/toggle`);
};

export const fetchExperiencePrimaryMediaApi = async (experienceId: number) => {
    return await axios.get(`/admin/experiences/${experienceId}/media/primary`);
};
