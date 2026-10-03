import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/store/reducer';
import { dashboardReducer } from '@/features/dashboard/store/reducer';
import { categoryReducer } from '@/features/category/store/reducer';
import { experienceReducer } from '@/features/experience/store/reducer';
import { settingsReducer } from '@/features/settings/store/reducer';
import { subCategoryReducer } from '@/features/subCategory/store/reducer';
import { vendorReducer } from '@/features/vendor/store/reducer';
import { userReducer } from '@/features/users/store/reducer';
import { roleReducer } from '@/features/roles/store/reducer';
import { locationReducer } from '@/features/location/store/reducer';
import { slotReducer } from '@/features/slot/store/reducer';
import { profileReducer } from '@/features/profile/store/reducer';
import { inclusionReducer } from '@/features/inclusion/store/reducer';
import { cancellationPolicyReducer } from '@/features/cancellationPolicy/store/reducer';
import { addonReducer } from '@/features/addon/store/reducer';
import { imageReducer } from '@/features/images/store/reducer';
import { bookingsReducer } from '@/features/bookings/store/reducer';
import { customerReducer } from '@/features/customers/store/reducer';
import { paymentReducer } from '@/features/payments/store/reducer';
import { promotionReducer } from '@/features/promotions/store/reducer';
import { promotionAssetReducer } from '@/features/promotionAssets/store/reducer';
import { reviewReducer } from '@/features/reviews/store/reducer';
import { reportReducer } from '@/features/reports/store/reducer';
import { inventoryReducer } from '@/features/inventory/store/reducer';
import { paymentPayoutReducer } from '@/features/payouts/store/reducer';
import { notificationReducer } from '@/features/notifications/store/reducer';
import { helpdeskReducer } from '@/features/helpdesk/store/reducer';
import { surveyReducer } from '@/features/surveys/store/reducer';
import { campaignReducer } from '@/features/campaigns/store/reducer';
import { invoiceReducer } from '@/features/invoices/store/reducer';
import { refundReducer } from '@/features/refunds/store/reducer';
import { waitlistReducer } from '@/features/waitlist/store/reducer';
import { timelineReducer } from '@/features/calendar-timeline/store/reducer';
import { logsReducer } from '@/features/activity-logs/store/reducer';
import { cmsReducer } from '@/features/cms/store/reducer';
import { faqReducer } from '@/features/faq/store/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    experience: experienceReducer,
    settings: settingsReducer,
    subCategory: subCategoryReducer,
    vendor: vendorReducer,
    user: userReducer,
    roles: roleReducer,
    location: locationReducer,
    slot: slotReducer,
    profile: profileReducer,
    inclusion: inclusionReducer,
    cancellationPolicy: cancellationPolicyReducer,
    addon: addonReducer,
    image: imageReducer,
    bookings: bookingsReducer,
    customers: customerReducer,
    payments: paymentReducer,
    promotions: promotionReducer,
    promotionAssets: promotionAssetReducer,
    reviews: reviewReducer,
    reports: reportReducer,
    inventory: inventoryReducer,
    payouts: paymentPayoutReducer,
    notifications: notificationReducer,
    helpdesk: helpdeskReducer,
    surveys: surveyReducer,
    campaigns: campaignReducer,
    invoices: invoiceReducer,
    refunds: refundReducer,
    waitlist: waitlistReducer,
    timeline: timelineReducer,
    logs: logsReducer,
    cms: cmsReducer,
    faq: faqReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
