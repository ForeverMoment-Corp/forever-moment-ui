import { connect } from 'react-redux';
import {
    getExperienceData,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    resetStatus,
    toggleCancellationPolicy,
    toggleInclusion,
    reorderExperience,
    associateLocation,
    updateExperienceLocation,
    disassociateLocation,
    toggleAddon,
    getExperienceAddons,
    toggleExperienceActive,
    toggleExperienceFeatured,
    bulkAttachMedia,
    disassociateMedia,
    getExperienceMedia,
    setPrimaryMedia,
    updateMediaAttachment,
    toggleMediaActive,
    uploadExperienceMedia,
    associateLocationTimeSlot,
    updateLocationTimeSlot,
    disassociateLocationTimeSlot,
    bulkAttachLocationTimeSlots,
    toggleLocationTimeSlot,
    toggleExperienceLocation,
    getExperiencePromotions,
    togglePromotion,
} from '@/features/experience/store/actions';
import { getImages } from '@/features/images/store/actions';
import { getSubCategoryData } from '@/features/subCategory/store/actions';
import { getInclusionData } from '@/features/inclusion/store/actions';
import { getCancellationPolicyData } from '@/features/cancellationPolicy/store/actions';
import { getLocationData } from '@/features/location/store/actions';
import { getAddonData } from '@/features/addon/store/actions';
import { getSlotData } from '@/features/slot/store/actions';
import { getPromotionsData } from '@/features/promotions/store/actions';
import Experience from './components/Experience';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.experience.data,
    selectedExperienceDetail: state.experience.selectedExperienceDetail,
    loading: state.experience.loading,
    error: state.experience.error,
    status: state.experience.status,
    subCategories: state.subCategory?.data || [],
    inclusions: state.inclusion?.data || [],
    cancellationPolicies: state.cancellationPolicy?.data || [],
    locations: state.location?.data || [],
    addons: state.addon?.data || [],
    slots: state.slot?.data || [],
    images: state.image?.data || [],
    experienceMedia: state.experience.experienceMedia || [],
    experienceAddons: state.experience.experienceAddons || [],
    addonsLoading: state.experience.addonsLoading || false,
    promotions: state.promotions?.data || [],
    experiencePromotions: state.experience.experiencePromotions || [],
    promotionsLoading: state.experience.promotionsLoading || false,
});

const mapDispatchToProps = {
    getExperienceData,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    resetStatus,
    getSubCategoryData,
    getInclusionData,
    getCancellationPolicyData,
    getLocationData,
    toggleCancellationPolicy,
    toggleInclusion,
    reorderExperience,
    onAssociateLocation: associateLocation,
    onUpdateLocation: updateExperienceLocation,
    onDisassociateLocation: disassociateLocation,
    onToggleExperienceLocation: toggleExperienceLocation,
    onAssociateLocationTimeSlot: associateLocationTimeSlot,
    onUpdateLocationTimeSlot: updateLocationTimeSlot,
    onDisassociateLocationTimeSlot: disassociateLocationTimeSlot,
    onBulkAttachLocationTimeSlots: bulkAttachLocationTimeSlots,
    onToggleLocationTimeSlot: toggleLocationTimeSlot,
    getAddonData,
    toggleAddon,
    getExperienceAddons,
    getSlotData,
    toggleExperienceActive,
    toggleExperienceFeatured,
    bulkAttachMedia,
    disassociateMedia,
    getExperienceMedia,
    setPrimaryMedia,
    updateMediaAttachment,
    toggleMediaActive,
    uploadExperienceMedia,
    getImages,
    getPromotionsData,
    getExperiencePromotions,
    togglePromotion,
};

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
