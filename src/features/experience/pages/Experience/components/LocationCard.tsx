import React from 'react';
import { MapPin, Edit2, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { TimeSlotItem } from './TimeSlotItem';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';

interface LocationCardProps {
    el: any;
    slots: any[];
    onEdit: (el: any) => void;
    onDisassociate: (locationId: number) => void;
    onToggleLocation: (locationId: number, mapperId: number) => void;
    onAddTimeSlot: (locationId: number) => void;
    onBulkAddTimeSlot: (locationId: number) => void;
    onEditTimeSlot: (locationId: number, ts: any) => void;
    onDeleteTimeSlot: (locationId: number, timeSlotId: number) => void;
    onToggleTimeSlot: (locationId: number, mapperId: number) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
    el,
    slots,
    onEdit,
    onDisassociate,
    onToggleLocation,
    onAddTimeSlot,
    onBulkAddTimeSlot,
    onEditTimeSlot,
    onDeleteTimeSlot,
    onToggleTimeSlot
}) => {
    return (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-blue-300">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                            {el.locationName} {el.city ? `(${el.city})` : ''}
                            <EditableStatusBadge
                                status={el.isActive ? 'Active' : 'Inactive'}
                                onChange={() => onToggleLocation(el.locationId, el.mapperId)}
                            />
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-slate-500">
                                Price: <span className="font-semibold text-slate-900 dark:text-slate-100">₹{el.priceOverride}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onBulkAddTimeSlot(el.locationId)}
                        className="p-1 px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded border border-emerald-100 dark:border-emerald-800 transition-colors"
                    >
                        Bulk Attach
                    </button>
                    <button
                        onClick={() => onAddTimeSlot(el.locationId)}
                        className="p-1 px-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded border border-blue-100 dark:border-blue-800 transition-colors"
                    >
                        + Time Slot
                    </button>
                    <button
                        onClick={() => onEdit(el)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDisassociate(el.locationId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-gray-800 mt-1">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center gap-1">
                        <Calendar size={12} /> Baseline Validity
                    </span>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {el.validFrom ? format(new Date(el.validFrom), 'MMM dd, yyyy') : 'N/A'} - {el.validTo ? format(new Date(el.validTo), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                </div>
            </div>

            {/* Associated Time Slots Section */}
            {el.timeslots && el.timeslots.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-3 block">Associated Time Slots</span>
                    <div className="space-y-2">
                        {el.timeslots.map((ts: any) => (
                            <TimeSlotItem
                                key={ts.mapperId}
                                ts={ts}
                                slots={slots}
                                onEdit={(ts) => onEditTimeSlot(el.locationId, ts)}
                                onDelete={(timeSlotId) => onDeleteTimeSlot(el.locationId, timeSlotId)}
                                onToggle={(mapperId) => onToggleTimeSlot(el.locationId, mapperId)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
