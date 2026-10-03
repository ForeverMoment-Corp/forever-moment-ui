import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/common/Modal';
import { DeleteModal } from '@/components/common/DeleteModal';
import toast from 'react-hot-toast';
import type { FaqPayload } from '@/features/faq/store/api';
import { FaqForm, type FaqFormData } from './FaqForm';
import { FaqSplitView } from './FaqSplitView';
import '../../css/styles.scss';

export interface FaqType {
    id: number;
    question: string;
    answer: string;
    displayOrder: number;
    isActive: boolean;
    createdOn?: string;
    updatedOn?: string;
}

interface FaqProps {
    data: FaqType[] | null;
    loading: boolean;
    error: string | null;
    getFaqData: (isBackground?: boolean) => void;
    createFaq: (data: FaqPayload) => Promise<any>;
    updateFaq: (id: number, data: FaqPayload) => Promise<any>;
    deleteFaq: (id: number) => Promise<any>;
    toggleFaq: (id: number) => Promise<any>;
    reorderFaq: (orderedIds: number[]) => Promise<any>;
}

const EMPTY_FORM: FaqFormData = { question: '', answer: '', isActive: true };

const byDisplayOrder = (a: FaqType, b: FaqType) => (a.displayOrder || 0) - (b.displayOrder || 0);

const Faq = ({
    data,
    loading,
    error,
    getFaqData,
    createFaq,
    updateFaq,
    deleteFaq,
    toggleFaq,
    reorderFaq
}: FaqProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedFaqId, setSelectedFaqId] = useState<number | null>(null);
    // Dropped order shown while the reorder request is in flight
    const [optimisticOrder, setOptimisticOrder] = useState<FaqType[] | null>(null);

    const faqs = useMemo(
        () => optimisticOrder ?? (Array.isArray(data) ? [...data].sort(byDisplayOrder) : []),
        [data, optimisticOrder]
    );
    // Derived so the details panel always reflects the latest fetched data
    const selectedFaq = faqs.find(f => f.id === selectedFaqId) ?? null;

    useEffect(() => {
        getFaqData();
    }, [getFaqData]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleDragReorder = async (newOrder: FaqType[]) => {
        setOptimisticOrder(newOrder);
        try {
            await reorderFaq(newOrder.map(f => f.id));
            toast.success('FAQ order updated');
        } catch (e) {
            console.error('Failed to reorder FAQs', e);
        } finally {
            setOptimisticOrder(null);
        }
    };

    const handleToggleActive = async (faq: FaqType) => {
        try {
            await toggleFaq(faq.id);
            toast.success(`FAQ marked ${faq.isActive ? 'inactive' : 'active'}`);
        } catch (e) {
            console.error('Failed to toggle FAQ', e);
        }
    };

    const handleOpenModal = (faq: FaqType | null = null) => {
        setEditingFaq(faq);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    const handleFormSubmit = async (submitted: FaqFormData) => {
        const payload: FaqPayload = {
            question: submitted.question.trim(),
            answer: submitted.answer.trim(),
            isActive: submitted.isActive,
        };
        try {
            if (editingFaq) {
                await updateFaq(editingFaq.id, { ...payload, displayOrder: editingFaq.displayOrder });
                toast.success('FAQ updated successfully');
            } else {
                // displayOrder omitted: the backend appends new FAQs to the end
                await createFaq(payload);
                toast.success('FAQ created successfully');
            }
            handleCloseModal();
        } catch (e) {
            console.error('Failed to save FAQ', e);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteFaq(deleteId);
                toast.success('FAQ deleted successfully');
                setIsDeleteModalOpen(false);
                setDeleteId(null);
            } catch (e) {
                console.error('Failed to delete FAQ', e);
            }
        }
    };

    return (
        <div className="faq-page-container w-full h-full flex flex-col">
            <FaqSplitView
                faqs={faqs}
                loading={loading}
                selectedFaq={selectedFaq}
                setSelectedFaq={(faq: FaqType | null) => setSelectedFaqId(faq?.id ?? null)}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                handleToggleActive={handleToggleActive}
                handleDragReorder={handleDragReorder}
                updateFaq={updateFaq}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
            >
                <FaqForm
                    key={editingFaq?.id ?? 'new'}
                    initialData={editingFaq
                        ? { question: editingFaq.question, answer: editingFaq.answer, isActive: editingFaq.isActive }
                        : EMPTY_FORM}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingFaq ? 'Update' : 'Save'}
                    isLoading={loading}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="FAQ"
                title="Delete FAQ"
                description="This will remove the FAQ from the Help page. Are you sure?"
            />
        </div>
    );
};

export default Faq;
