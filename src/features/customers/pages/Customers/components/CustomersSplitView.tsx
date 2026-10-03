import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { RowActions } from '@/components/common/RowActions';
import { StatusBadge } from '@/components/common/StatusBadge';

export const CustomersSplitView = ({
    customers,
    selectedCustomer,
    setSelectedCustomer,
    handleOpenModal,
    handleDeleteClick,
    loading
}: any) => {

    const columns = [
        {
            header: 'Customer',
            accessorKey: 'name',
            className: 'w-[30%] min-w-[200px] px-3 text-left font-semibold text-slate-900 dark:text-white',
            render: (customer: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-bold text-xs">
                        {customer.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">{customer.name}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{customer.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            className: 'w-[15%] min-w-[100px] px-3 text-left',
            render: (customer: any) => (
                <StatusBadge 
                    status={customer.status} 
                    activeValue={customer.status === 'VIP' ? customer.status : 'Active'}
                    className={customer.status === 'VIP' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                />
            )
        },
        {
            header: 'Bookings',
            accessorKey: 'totalBookings',
            className: 'w-[15%] min-w-[100px] px-3 text-left font-medium text-slate-600 dark:text-slate-400',
        },
        {
            header: 'Spent',
            accessorKey: 'totalSpent',
            className: 'w-[20%] min-w-[120px] px-3 text-left font-bold text-slate-900 dark:text-white',
            render: (customer: any) => `₹${customer.totalSpent.toLocaleString()}`
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[20%] min-w-[100px] px-3 text-right',
            render: (customer: any) => (
                <RowActions
                    onEdit={() => handleOpenModal(customer)}
                    onDelete={() => handleDeleteClick(customer.id)}
                />
            )
        }
    ];

    const renderListItem = useCallback((customer: any, isSelected: boolean) => {
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                    isSelected
                        ? "bg-[var(--accent-light)]"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50"
                )}
            >
                {isSelected && (
                    <div className="absolute left-0 w-1 h-8 bg-[var(--accent)] rounded-r-md" />
                )}
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm shrink-0">
                    {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5",
                        isSelected ? "text-[var(--accent)]" : "text-slate-900 dark:text-white group-hover:text-[var(--accent)]"
                    )}>{customer.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{customer.email}</div>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-[12px] font-bold text-slate-900 dark:text-white">₹{customer.totalSpent.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{customer.status}</div>
                </div>
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((customer: any) => {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[var(--accent-ring)]">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <span>{customer.email}</span>
                                <span>•</span>
                                <span>{customer.phone}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700">
                        <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Bookings</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{customer.totalBookings}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700">
                        <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Spent</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">₹{customer.totalSpent.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700">
                        <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Customer Tier</div>
                        <div className="text-xl font-bold text-[var(--accent)]">{customer.status}</div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-3 py-3 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                        <span className="text-xs font-semibold text-slate-400">Joined {customer.joinDate}</span>
                    </div>
                    <div className="p-3 text-center py-5">
                        <div className="text-3xl mb-2 opacity-20">📜</div>
                        <p className="text-sm text-slate-400 font-medium">History is synced from live bookings.</p>
                    </div>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={customers}
            loading={loading}
            resourceName="Customer"
            resourceNamePlural="Customers"
            selectedItem={selectedCustomer}
            onSelectItem={setSelectedCustomer}
            columns={columns}
            keyExtractor={(customer: any) => customer.id}
            renderListItem={renderListItem}
            renderDetailsPanel={renderDetailsPanel}
            searchFields={['name', 'email']}
            emptyStateIcon="👥"
        />
    );
};
