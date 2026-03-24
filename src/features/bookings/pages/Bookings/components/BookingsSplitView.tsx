import { useCallback, useMemo } from 'react';
import { CheckCircle2, DollarSign, ListOrdered } from 'lucide-react';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatsRow } from '@/components/common/StatsRow';

interface BookingsSplitViewProps {
    bookings: any[];
    handleOpenModal: (booking?: any | null) => void;
    handleDeleteClick: (id: string | number) => void;
    selectedBooking: any | null;
    setSelectedBooking: (booking: any | null) => void;
    loading: boolean;
}

export const BookingsSplitView = ({
    bookings,
    handleOpenModal,
    handleDeleteClick,
    selectedBooking,
    setSelectedBooking,
    loading,
}: BookingsSplitViewProps) => {

    const columns = [
        {
            accessorKey: 'id',
            className: 'py-1.5 px-4 text-left font-semibold text-slate-900 dark:text-white',
            render: (booking: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📅</span>
                        {booking.id}
                    </div>
                    <div>
                        <div className="font-semibold text-[13.5px] text-slate-800 dark:text-slate-100 leading-tight">{booking.eventName}</div>
                        <div className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5">{booking.customerName}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Date',
            accessorKey: 'date',
            className: 'py-1.5 px-4 text-left',
            render: (booking: any) => (
                <div className="text-[13px] text-slate-600 dark:text-slate-300">
                    {booking.date}
                </div>
            )
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            className: 'py-1.5 px-4 text-right',
            render: (booking: any) => (
                <div className="text-right">
                    <span className="font-semibold text-[14px] text-slate-800 dark:text-slate-100">${booking.amount}</span>
                </div>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'py-1.5 px-4 text-center',
            render: (booking: any) => (
                <EditableStatusBadge
                    status={booking.status}
                    options={['Confirmed', 'Pending', 'Cancelled']}
                    onChange={async (val) => {
                        console.log('Update status', booking.id, val);
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'py-1.5 px-4 text-right',
            render: (booking: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(booking)}
                        onDelete={() => handleDeleteClick(booking.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((booking: any, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                isSelected
                    ? "bg-violet-50/80 dark:bg-violet-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-violet-600 opacity-100" : "opacity-0"
            )} />
            <div className={cn(
                "h-7 px-2 min-w-[40px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0 ml-1",
                "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
            )}>
                <span className="text-[12px] leading-none">📅</span>
                {booking.id.split('-').pop()}
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-violet-900 dark:text-violet-300" : "text-slate-800 dark:text-slate-100 group-hover:text-violet-600"
                )}>{booking.eventName}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {booking.customerName}
                </div>
            </div>
            <div className={cn(
                "w-2 h-2 rounded-full shrink-0 shadow-sm",
                booking.status === 'Confirmed' ? 'bg-emerald-500' :
                booking.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
            )} />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((booking: any) => {
        if (!booking) return null;
        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{booking.eventName}</h2>
                        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">Booking References: {booking.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={cn(
                            "px-3 py-1 text-xs font-semibold rounded-full",
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                         )}>
                             {booking.status}
                         </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                         <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-3">Customer Info</h3>
                         <div className="space-y-2">
                             <div>
                                 <div className="text-xs text-slate-400">Name</div>
                                 <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{booking.customerName}</div>
                             </div>
                         </div>
                     </div>
                     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                         <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-3">Booking Details</h3>
                         <div className="space-y-2">
                             <div>
                                 <div className="text-xs text-slate-400">Date</div>
                                 <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{booking.date}</div>
                             </div>
                             <div>
                                 <div className="text-xs text-slate-400 mt-2">Total Amount</div>
                                 <div className="text-sm font-medium text-slate-700 dark:text-slate-200">${booking.amount}</div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        );
    }, []);

    const customFilter = useCallback((booking: any, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            matchStatus = activeFilters.status.includes(booking.status);
        }
        return matchStatus;
    }, []);

    const customSearch = useCallback((booking: any, search: string) => {
        const searchLower = search.toLowerCase();
        return booking.eventName?.toLowerCase().includes(searchLower) ||
               booking.customerName?.toLowerCase().includes(searchLower) ||
               booking.id?.toLowerCase().includes(searchLower);
    }, []);

    const renderStatsRow = useMemo(() => () => {
        const list = bookings || [];
        const total = list.length;
        const confirmed = list.filter((b: any) => b.status === 'Confirmed').length;
        const totalValue = list.reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);

        const cards = [
            {
                icon: <ListOrdered size={18} color="#6c63ff" />,
                iconBg: '#ede9ff',
                value: total,
                label: 'Total Bookings',
            },
            {
                icon: <CheckCircle2 size={18} color="#12b76a" />,
                iconBg: '#ecfdf3',
                value: confirmed,
                label: 'Confirmed',
            },
            {
                icon: <DollarSign size={18} color="#f04438" />,
                iconBg: '#fef3f2',
                value: `$${totalValue.toLocaleString()}`,
                label: 'Total Revenue',
            },
        ];

        return <StatsRow stats={cards} />;
    }, [bookings]);

    return (
        <CrudSplitViewLayout
            data={bookings || []}
            loading={loading}
            resourceName="Booking"
            resourceNamePlural="Bookings"
            selectedItem={selectedBooking}
            onSelectItem={setSelectedBooking}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Overview' }]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
                {
                    id: 'status',
                    name: 'Status',
                    options: [
                        { id: '1', label: 'Confirmed', value: 'Confirmed' },
                        { id: '2', label: 'Pending', value: 'Pending' },
                        { id: '3', label: 'Cancelled', value: 'Cancelled' },
                    ]
                }
            ]}
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
            renderStatsRow={renderStatsRow}
        />
    );
};
