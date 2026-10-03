import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { RowActions } from '@/components/common/RowActions';
import { StatusBadge } from '@/components/common/StatusBadge';

export const PaymentsSplitView = ({
    payments,
    selectedPayment,
    setSelectedPayment,
    handleOpenModal,
    handleDeleteClick,
    loading
}: any) => {

    const columns = [
        {
            header: 'Transaction ID',
            accessorKey: 'id',
            className: 'w-[20%] min-w-[120px] px-3 text-left font-bold text-slate-900 dark:text-white',
            render: (pay: any) => (
                <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-[11px] font-bold">{pay.id}</span>
                </div>
            )
        },
        {
            header: 'Customer',
            accessorKey: 'customerName',
            className: 'w-[25%] min-w-[150px] px-3 text-left text-slate-600 dark:text-slate-400 font-medium',
        },
        {
            header: 'Method',
            accessorKey: 'method',
            className: 'w-[15%] min-w-[100px] px-3 text-left text-slate-500 dark:text-slate-400',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            className: 'w-[15%] min-w-[100px] px-3 text-left',
            render: (pay: any) => (
                <StatusBadge 
                    status={pay.status} 
                    activeValue="Captured"
                />
            )
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            className: 'w-[15%] min-w-[100px] px-3 text-right font-bold text-slate-900 dark:text-white',
            render: (pay: any) => `₹${pay.amount.toLocaleString()}`
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[10%] min-w-[100px] px-3 text-right',
            render: (pay: any) => (
                <RowActions
                    onEdit={() => handleOpenModal(pay)}
                    onDelete={() => handleDeleteClick(pay.id)}
                />
            )
        }
    ];

    const renderListItem = useCallback((pay: any, isSelected: boolean) => {
        return (
            <div
                className={cn(
                    "flex flex-col p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative border-l-4",
                    isSelected
                        ? "bg-[var(--accent-light)] border-[var(--accent)]"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50 border-transparent"
                )}
            >
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{pay.id}</span>
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">₹{pay.amount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className={cn(
                        "font-semibold text-[13px] truncate",
                        isSelected ? "text-[var(--accent)]" : "text-slate-700 dark:text-slate-200"
                    )}>{pay.customerName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{pay.date} • {pay.method}</span>
                </div>
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((pay: any) => {
        return (
            <div className="space-y-3">
                <div className="bg-[var(--accent)] p-4 rounded-lg text-white shadow-lg shadow-[var(--accent-ring)] text-center">
                    <div className="text-[11px] uppercase tracking-[0.2em] font-bold opacity-80 mb-2">Transaction Amount</div>
                    <div className="text-4xl font-black mb-1">₹{pay.amount.toLocaleString()}</div>
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold mt-2">
                         {pay.id} • {pay.status.toUpperCase()}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-3 py-3 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30 font-bold text-slate-900 dark:text-white">
                        Transaction Details
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-y-3">
                        <div>
                            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Customer Name</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{pay.customerName}</p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Payment Method</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{pay.method}</p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Booking Link</p>
                            <p className="font-semibold text-[var(--accent)] cursor-pointer hover:underline">{pay.bookingId}</p>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Timestamp</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{pay.date} 14:32:01</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);

    return (
        <CrudSplitViewLayout
            data={payments}
            loading={loading}
            resourceName="Payment"
            resourceNamePlural="Payments"
            selectedItem={selectedPayment}
            onSelectItem={setSelectedPayment}
            columns={columns}
            keyExtractor={(pay: any) => pay.id}
            renderListItem={renderListItem}
            renderDetailsPanel={renderDetailsPanel}
            searchFields={['id', 'customerName']}
            emptyStateIcon="💳"
        />
    );
};
