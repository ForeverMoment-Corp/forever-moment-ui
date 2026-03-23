import { Clock, Banknote, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';

interface TimeSlotItemProps {
    ts: any;
    slots: any[];
    onEdit: (ts: any) => void;
    onDelete: (timeSlotId: number) => void;
    onToggle: (mapperId: number) => void;
}

export const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ ts, slots, onEdit, onDelete, onToggle }) => {
    const slotLabel = slots.find((s: any) => s.id === ts.timeSlotId)?.label || 'Time Slot';
    
    return (
        <div className="bg-slate-50 dark:bg-gray-800/40 rounded-lg p-3 border border-slate-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                    <Clock size={14} className="text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase text-[10px] tracking-tight mr-1">{slotLabel}:</span>
                    {ts.startTime} - {ts.endTime}
                </div>
                <div className="flex items-center gap-1">
                    <EditableStatusBadge
                        status={ts.isActive ? 'Active' : 'Inactive'}
                        onChange={() => onToggle(ts.mapperId)}
                    />
                    <button
                        onClick={() => onEdit(ts)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={() => onDelete(ts.timeSlotId)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <Banknote size={12} className="text-slate-400" />
                    <span>Price: <span className="font-semibold text-slate-900 dark:text-slate-200">₹{ts.priceOverride}</span></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <Users size={12} className="text-slate-400" />
                    <span>Cap: <span className="font-semibold text-slate-900 dark:text-slate-200">{ts.availableCapacity}/{ts.maxCapacity}</span></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 col-span-2">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{format(new Date(ts.validFrom), 'MMM dd')} - {format(new Date(ts.validTo), 'MMM dd, yyyy')}</span>
                </div>
            </div>
        </div>
    );
};
