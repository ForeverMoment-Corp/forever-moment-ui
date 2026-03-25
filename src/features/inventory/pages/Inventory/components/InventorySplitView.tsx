import React, { useCallback } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Package, Box, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InventorySplitViewProps {
    inventory: any[];
    selectedInventory: any | null;
    setSelectedInventory: (item: any | null) => void;
    handleOpenModal: (item?: any) => void;
    handleDeleteClick: (id: string | number) => void;
    loading: boolean;
}

export const InventorySplitView: React.FC<InventorySplitViewProps> = ({
    inventory,
    selectedInventory,
    setSelectedInventory,
    handleOpenModal,
    handleDeleteClick,
    loading
}) => {
    const columns = [
        {
            header: 'Item Name',
            accessorKey: 'name',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500">
                        <Package size={20} />
                    </div>
                    <div>
                        <div className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{item.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Stock',
            accessorKey: 'quantity',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[13.5px] font-black text-slate-900 dark:text-white">{item.quantity} {item.unit}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.location}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item: any) => (
                <StatusBadge 
                    status={item.status} 
                    variant={
                        item.status === 'In Stock' ? 'success' : 
                        item.status === 'Low Stock' ? 'warning' : 'neutral'
                    } 
                />
            )
        }
    ];

    const renderListItem = useCallback((item: any, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                isSelected
                    ? "bg-[var(--accent-light)]"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-[var(--accent)] opacity-100" : "opacity-0"
            )} />
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 shrink-0">
                <Package size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.quantity} {item.unit} • {item.location}
                </div>
            </div>
            <StatusBadge 
                status={item.status} 
                variant={item.status === 'In Stock' ? 'success' : 'warning'} 
                className="scale-75 origin-right"
            />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((item: any) => {
        if (!item) return null;
        return (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-800/20">
                            <Box size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-1">{item.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.id}</span>
                                <StatusBadge status={item.status} variant={item.status === 'In Stock' ? 'success' : 'neutral'} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleOpenModal(item)}
                            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all active:scale-95 border border-transparent hover:border-red-100 dark:hover:border-red-900/40"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-slate-100 dark:border-gray-800/60">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                        <p className="text-[17px] font-black text-slate-900 dark:text-white">{item.quantity} {item.unit}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-slate-100 dark:border-gray-800/60">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-[17px] font-black text-slate-900 dark:text-white">{item.location}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Item Information</h3>
                    <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800/60 overflow-hidden">
                        {[
                            { label: 'Category', value: item.category },
                            { label: 'Unit of Measure', value: item.unit },
                            { label: 'Asset Reference', value: 'FM-AST-' + item.id.split('-')[1] },
                            { label: 'Last Inspected', value: '2025-05-20' }
                        ].map((info, i) => (
                            <div key={i} className="px-5 py-3.5 flex items-center justify-between border-b last:border-0 border-slate-50 dark:border-gray-800/40">
                                <span className="text-[13px] font-bold text-slate-400">{info.label}</span>
                                <span className="text-[13px] font-black text-slate-700 dark:text-slate-200">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }, [handleOpenModal, handleDeleteClick]);

    return (
        <CrudSplitViewLayout
            data={inventory}
            loading={loading}
            resourceName="Inventory Item"
            resourceNamePlural="Inventory"
            selectedItem={selectedInventory}
            onSelectItem={setSelectedInventory}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Details' }]}
            renderDetailsPanel={renderDetailsPanel}
            onAdd={() => handleOpenModal()}
            searchFields={['name', 'location', 'category']}
        />
    );
};
