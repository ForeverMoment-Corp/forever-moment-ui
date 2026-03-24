import { Edit2, Trash2 } from 'lucide-react';

interface RowActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const RowActions = ({ onEdit, onDelete }: RowActionsProps) => {
    return (
        <div className="flex justify-end gap-1.5">
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                title="Edit"
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-gray-700 bg-transparent text-slate-500 dark:text-slate-400 cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:hover:border-[var(--accent)] dark:hover:text-[var(--accent)]"
            >
                <Edit2 size={14} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                title="Delete"
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-gray-700 bg-transparent text-slate-500 dark:text-slate-400 cursor-pointer transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};
