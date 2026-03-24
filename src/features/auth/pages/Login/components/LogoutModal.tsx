import { LogOut } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Logout"
            description="This will logout you from the system. Are you sure?"
            icon={LogOut}
            variant="info"
            className="sm:max-w-lg"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-5 rounded-xl bg-slate-100 dark:bg-gray-800 text-[14px] font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-gray-700 active:scale-[0.98]"
                    >
                        No, stay
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 px-5 rounded-xl bg-[var(--accent)] text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                    >
                        Yes, logout
                    </button>
                </>
            }
        />
    );
};
