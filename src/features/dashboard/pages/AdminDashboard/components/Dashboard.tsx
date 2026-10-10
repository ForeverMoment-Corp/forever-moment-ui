import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Wallet,
    Users,
    Sparkles,
    Layers,
    MapPin,
    Clock,
    Ticket,
    Image,
    Store,
    Headset,
    History,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { StatCard } from './StatCard';

interface DashboardProps {
    data: any;
    loading: boolean;
    error: string | null;
    getDashboardData: () => void;
}

const stats = [
    { label: 'Bookings', value: '—', delta: 'This month', icon: Calendar },
    { label: 'Revenue', value: '—', delta: 'This month', icon: Wallet },
    { label: 'Customers', value: '—', delta: 'All time', icon: Users },
    { label: 'Experiences', value: '—', delta: 'Live', icon: Sparkles },
];

const quickActions = [
    { label: 'Experiences', path: '/admin/experience', icon: Sparkles },
    { label: 'Categories', path: '/admin/category', icon: Layers },
    { label: 'Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Time Slots', path: '/admin/slots', icon: Clock },
    { label: 'Promotions', path: '/admin/promotions', icon: Ticket },
    { label: 'Media', path: '/admin/images', icon: Image },
    { label: 'Vendors', path: '/admin/vendors', icon: Store },
    { label: 'Helpdesk', path: '/admin/helpdesk', icon: Headset },
];

const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dashboard = (_props: DashboardProps) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const firstName = (user?.name || 'Admin').split(' ')[0];

    return (
        <div className='space-y-6'>
            <div>
                <p className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    {greeting()}
                </p>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mt-1'>{firstName} 👋</h1>
                <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                    Here's what's happening with Forever Moment today.
                </p>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                {stats.map((s, i) => (
                    <StatCard key={s.label} {...s} primary={i === 0} />
                ))}
            </div>

            <section>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Quick actions</h2>
                <div className='grid grid-cols-4 lg:grid-cols-8 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl py-3 px-1'>
                    {quickActions.map((a) => (
                        <button
                            key={a.path}
                            type='button'
                            onClick={() => navigate(a.path)}
                            aria-label={`Open ${a.label}`}
                            className='flex flex-col items-center py-2 cursor-pointer rounded-lg transition-opacity hover:opacity-70'
                        >
                            <span className='w-12 h-12 rounded-xl bg-accent-light dark:bg-accent/20 flex items-center justify-center mb-1.5'>
                                <a.icon size={22} className='text-accent' />
                            </span>
                            <span className='text-xs text-slate-600 dark:text-slate-300 truncate max-w-full px-1'>
                                {a.label}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>Recent activity</h2>
                <div className='bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl py-10 px-4 flex flex-col items-center text-center'>
                    <span className='w-12 h-12 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-3'>
                        <History size={22} className='text-slate-400' />
                    </span>
                    <p className='font-semibold text-gray-900 dark:text-white'>No recent activity</p>
                    <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                        Bookings and changes will show up here.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
