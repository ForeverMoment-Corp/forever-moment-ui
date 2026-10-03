import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/common/Modal';
import type { RootState } from '@/store/store';
import { getSupportQueries, resolveSupportQuery } from '../../../store/actions';
import type { SupportQuery } from '../../../store/api';
import { HelpdeskSplitView } from './HelpdeskSplitView';

const Helpdesk = () => {
    const dispatch = useDispatch<any>();
    const { data: queries, loading, resolving, error } = useSelector((state: RootState) => state.helpdesk);
    const [selectedQueryId, setSelectedQueryId] = useState<number | null>(null);
    const [resolveTarget, setResolveTarget] = useState<SupportQuery | null>(null);

    // Derived so the details panel reflects a query once it is resolved
    const selectedQuery = queries.find(q => q.id === selectedQueryId) ?? null;

    useEffect(() => {
        dispatch(getSupportQueries());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleConfirmResolve = async () => {
        if (!resolveTarget) return;
        try {
            await dispatch(resolveSupportQuery(resolveTarget.id));
            toast.success(`Query ${resolveTarget.referenceId} marked as resolved`);
            setResolveTarget(null);
        } catch (e) {
            console.error('Failed to resolve support query', e);
        }
    };

    return (
        <div className="helpdesk-page-container w-full h-full flex flex-col">
            <HelpdeskSplitView
                queries={queries}
                loading={loading}
                selectedQuery={selectedQuery}
                setSelectedQuery={(q: SupportQuery | null) => setSelectedQueryId(q?.id ?? null)}
                onResolve={setResolveTarget}
            />

            <Modal
                isOpen={!!resolveTarget}
                onClose={() => setResolveTarget(null)}
                title="Mark as Resolved"
                description={`Mark query ${resolveTarget?.referenceId ?? ''} from ${resolveTarget?.name ?? 'this customer'} as resolved? This can't be reopened.`}
                icon={CheckCircle}
                variant="primary"
                className="sm:max-w-lg"
                footer={
                    <>
                        <button
                            onClick={() => setResolveTarget(null)}
                            disabled={resolving}
                            className="flex-1 py-3 px-5 rounded-xl bg-slate-100 dark:bg-gray-800 text-[14px] font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmResolve}
                            disabled={resolving}
                            className="flex-1 py-3 px-5 rounded-xl bg-[var(--accent)] text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-60"
                        >
                            {resolving ? 'Resolving...' : 'Mark resolved'}
                        </button>
                    </>
                }
            />
        </div>
    );
};

export default Helpdesk;
