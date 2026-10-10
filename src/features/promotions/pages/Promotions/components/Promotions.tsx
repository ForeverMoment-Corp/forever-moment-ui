import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPromotionsData, createPromotionAction, updatePromotionAction, deletePromotionAction } from '../../../store/actions';
import { PromotionsSplitView } from './PromotionsSplitView';
import { PromotionsModal } from './PromotionsModal';

const Promotions = () => {
    const dispatch = useDispatch<any>();
    const { data: promotions, loading } = useSelector((state: any) => state.promotions);
    const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<any | null>(null);

    useEffect(() => {
        dispatch(getPromotionsData());
    }, [dispatch]);

    // Re-select the open promotion after a refetch so the details panel shows saved values
    useEffect(() => {
        if (selectedPromotion && Array.isArray(promotions)) {
            const updated = promotions.find((p: any) => String(p.id) === String(selectedPromotion.id));
            if (updated && updated !== selectedPromotion) setSelectedPromotion(updated);
        }
    }, [promotions]); // eslint-disable-line react-hooks/exhaustive-deps

    const updatePromotion = useCallback(
        (id: number | string, data: any) => dispatch(updatePromotionAction(id, data)),
        [dispatch]
    );

    const handleOpenModal = (promo: any | null = null) => {
        setEditingPromo(promo);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            dispatch(deletePromotionAction(id));
            if (selectedPromotion?.id === id) {
                setSelectedPromotion(null);
            }
        }
    };

    const handleModalSubmit = (data: any) => {
        if (editingPromo) {
            dispatch(updatePromotionAction(editingPromo.id, data));
        } else {
            dispatch(createPromotionAction(data));
        }
        setIsModalOpen(false);
        setEditingPromo(null);
    };

    return (
        <div className="promotions-page-container w-full h-full flex flex-col relative">
            <PromotionsSplitView
                promotions={promotions}
                selectedPromotion={selectedPromotion}
                setSelectedPromotion={setSelectedPromotion}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                updatePromotion={updatePromotion}
                loading={loading}
            />
            
            {isModalOpen && (
                <PromotionsModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingPromo(null);
                    }}
                    promo={editingPromo}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    );
};

export default Promotions;
