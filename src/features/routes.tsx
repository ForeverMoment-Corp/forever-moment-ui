import { dashboardRoutes } from '@/features/dashboard/pages/routes';
import { categoryRoutes } from '@/features/category/pages/routes';
import { experienceRoutes } from '@/features/experience/pages/routes';
import { settingsRoutes } from '@/features/settings/pages/routes';
import { subCategoryRoutes } from '@/features/subCategory/pages/routes';
import { vendorRoutes } from '@/features/vendor/pages/routes';
import { userRoutes } from '@/features/users/pages/routes';
import { roleRoutes } from '@/features/roles/pages/routes';
import { locationRoutes } from '@/features/location/pages/routes';
import { slotRoutes } from '@/features/slot/pages/routes';
import { profileRoutes } from '@/features/profile/pages/routes';
import { inclusionRoutes } from '@/features/inclusion/pages/routes';
import { cancellationPolicyRoutes } from '@/features/cancellationPolicy/pages/routes';
import { addonRoutes } from '@/features/addon/pages/routes';
import { imageRoutes } from '@/features/images/pages/routes';
import { bookingsRoutes } from '@/features/bookings/pages/routes';
import { customerRoutes } from '@/features/customers/pages/routes';
import { paymentRoutes } from '@/features/payments/pages/routes';
import { promotionRoutes } from '@/features/promotions/pages/routes';
import { reviewRoutes } from '@/features/reviews/pages/routes';
import { reportRoutes } from '@/features/reports/pages/routes';
import { inventoryRoutes } from '@/features/inventory/pages/routes';
import { payoutRoutes } from '@/features/payouts/pages/routes';
import { notificationRoutes } from '@/features/notifications/pages/routes';
import { helpdeskRoutes } from '@/features/helpdesk/pages/routes';
import { surveyRoutes } from '@/features/surveys/pages/routes';
import { campaignRoutes } from '@/features/campaigns/pages/routes';
import { invoiceRoutes } from '@/features/invoices/pages/routes';
import { refundRoutes } from '@/features/refunds/pages/routes';
import { waitlistRoutes } from '@/features/waitlist/pages/routes';
import { timelineRoutes } from '@/features/calendar-timeline/pages/routes';
import { logsRoutes } from '@/features/activity-logs/pages/routes';
import { cmsRoutes } from '@/features/cms/pages/routes';

export const adminRoutes = [
    ...dashboardRoutes,
    ...categoryRoutes,
    ...experienceRoutes,
    ...settingsRoutes,
    ...subCategoryRoutes,
    ...vendorRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...locationRoutes,
    ...slotRoutes,
    ...profileRoutes,
    ...inclusionRoutes,
    ...cancellationPolicyRoutes,
    ...addonRoutes,
    ...imageRoutes,
    ...bookingsRoutes,
    ...customerRoutes,
    ...paymentRoutes,
    ...promotionRoutes,
    ...reviewRoutes,
    ...reportRoutes,
    ...inventoryRoutes,
    ...payoutRoutes,
    ...notificationRoutes,
    ...helpdeskRoutes,
    ...surveyRoutes,
    ...campaignRoutes,
    ...invoiceRoutes,
    ...refundRoutes,
    ...waitlistRoutes,
    ...timelineRoutes,
    ...logsRoutes,
    ...cmsRoutes,
];
