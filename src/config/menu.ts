import {
    LayoutDashboard,
    Layers,
    Sparkles,
    Calendar,
    Tag,
    Users,
    Briefcase,
    UserCog,
    Store,
    MapPin,
    Clock,
    Settings,
    Gift,
    ShieldAlert,
    Image,
    CreditCard,
    Ticket,
    Star,
    BarChart3,
    HeartHandshake,
    Package,
    HandCoins,
    History,
    Bell,
    Headset,
    CalendarDays,
    ListOrdered,
    ClipboardCheck,
    Globe,
    Megaphone,
    Receipt,
    RotateCcw,
    GalleryHorizontalEnd,
    CircleHelp
} from 'lucide-react';

export interface SidebarItem {
    name: string;
    path?: string;
    icon: React.ElementType;
    children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
    {
        name: 'Dashboard',
        path: '/admin',
        icon: LayoutDashboard
    },
    {
        name: 'Event Management',
        icon: Sparkles,
        children: [
            { name: 'Experience', path: '/admin/experience', icon: Sparkles },
            { name: 'Category', path: '/admin/category', icon: Layers },
            { name: 'Sub Category', path: '/admin/subCategory', icon: Tag },
            { name: 'Inclusions', path: '/admin/inclusions', icon: Gift },
            { name: 'Policies', path: '/admin/cancellation-policies', icon: ShieldAlert },
            { name: 'Addons', path: '/admin/addons', icon: Sparkles },
            { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
            { name: 'Calendar (Timeline)', path: '/admin/calendar-timeline', icon: CalendarDays },
            { name: 'Waitlist', path: '/admin/waitlist', icon: ListOrdered },
        ]
    },
    {
        name: 'CRM',
        icon: HeartHandshake,
        children: [
            { name: 'Customers', path: '/admin/customers', icon: Users },
            { name: 'Reviews', path: '/admin/reviews', icon: Star },
            { name: 'Helpdesk', path: '/admin/helpdesk', icon: Headset },
            { name: 'FAQs', path: '/admin/faqs', icon: CircleHelp },
            { name: 'Surveys', path: '/admin/surveys', icon: ClipboardCheck },
            { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        ]
    },
    {
        name: 'Sales & Marketing',
        icon: Ticket,
        children: [
            { name: 'Payments', path: '/admin/payments', icon: CreditCard },
            { name: 'Promotions', path: '/admin/promotions', icon: Ticket },
            { name: 'Promotion Assets', path: '/admin/promotion-assets', icon: GalleryHorizontalEnd },
            { name: 'Campaigns', path: '/admin/campaigns', icon: Megaphone },
            { name: 'Taxes & Invoices', path: '/admin/invoices', icon: Receipt },
            { name: 'Refunds & Disputes', path: '/admin/refunds', icon: RotateCcw },
        ]
    },
    {
        name: 'Operations',
        icon: Calendar,
        children: [
            { name: 'Locations', path: '/admin/locations', icon: MapPin },
            { name: 'Time Slots', path: '/admin/slots', icon: Clock },
            { name: 'Images', path: '/admin/images', icon: Image },
            { name: 'Vendors', path: '/admin/vendors', icon: Store },
            { name: 'Inventory', path: '/admin/inventory', icon: Package },
            { name: 'Vendor Payouts', path: '/admin/payouts', icon: HandCoins },
        ]
    },
    {
        name: 'Administration',
        icon: UserCog,
        children: [
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Roles', path: '/admin/roles', icon: Briefcase },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
            { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
            { name: 'Activity Logs', path: '/admin/activity-logs', icon: History },
            { name: 'CMS', path: '/admin/cms', icon: Globe },
        ]
    },
];
