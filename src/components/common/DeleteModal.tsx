import { Modal } from './Modal';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemType?: string;
}

export const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description,
    itemType = "item"
}: DeleteModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
            icon={Trash2}
            variant="danger"
            className="sm:max-w-lg"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-5 rounded-xl bg-slate-100 dark:bg-gray-800 text-[14px] font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-gray-700 active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-3 px-5 rounded-xl bg-[var(--accent)] text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                    >
                        Delete
                    </button>
                </>
            }
        />
    );
};
