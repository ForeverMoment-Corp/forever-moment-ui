import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportsData } from '../../../store/actions';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const Reports = () => {
    const dispatch = useDispatch<any>();
    const { data, loading } = useSelector((state: any) => state.reports);

    useEffect(() => {
        dispatch(getReportsData());
    }, [dispatch]);

    if (loading) return <div className="p-10 text-center font-bold">Loading Reports...</div>;

    // Map icons to the labels since they can't be stored in Redux easily (serializable)
    const iconMap: Record<string, any> = {
        'Total Revenue': DollarSign,
        'Active Bookings': Calendar,
        'New Customers': Users,
        'Conversion Rate': TrendingUp
    };

    const { stats, topExperiences } = data;

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6 w-full">
                <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
                    <div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white mb-1">Analytics Reports</h1>
                        <p className="text-[13.5px] text-slate-500 dark:text-slate-400">
                            Monitor your ERP performance, revenue trends, and customer engagement metrics.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat: any, i: number) => {
                            const Icon = iconMap[stat.label] || BarChart3;
                            return (
                                <div key={i} className="bg-white dark:bg-[#0f1117] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-2 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{stat.change}</span>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Curve Placeholder */}
                        <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[350px]">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-gray-900/20 flex items-center justify-between">
                                <div>
                                    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Revenue Growth</h2>
                                    <p className="text-[12px] text-slate-500 dark:text-slate-400">Net revenue tracked over the last 6 months.</p>
                                </div>
                                <BarChart3 size={18} className="text-slate-400" />
                            </div>
                            <div className="flex-1 flex items-center justify-center p-6 grayscale opacity-30">
                                <div className="text-center">
                                    <BarChart3 size={48} className="mx-auto mb-2" />
                                    <p className="text-sm font-bold">Chart visualization is generating...</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Experiences */}
                        <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-gray-900/20">
                                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Best Performing Experiences</h2>
                                <p className="text-[12px] text-slate-500 dark:text-slate-400">Ranked by booking volume and customer ratings.</p>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-gray-800">
                                {topExperiences.map((item: any, idx: number) => (
                                    <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-300">#{idx + 1}</span>
                                            <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-slate-900 dark:text-white">{item.bookings} bookings</div>
                                            <div className="text-[10px] text-orange-500 font-bold">★ {item.rating}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
