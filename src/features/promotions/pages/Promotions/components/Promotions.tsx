import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPromotionsData } from '../../../store/actions';
import { PromotionsSplitView } from './PromotionsSplitView';

export interface PromotionType {
    id: string;
    code: string;
    type: 'Percentage' | 'Fixed Amount';
    value: number;
    minSpend: number;
    status: 'Active' | 'Expired' | 'Scheduled';
    usageCount: number;
    expiryDate: string;
}

const Promotions = () => {
    const dispatch = useDispatch<any>();
    const { data: promotions, loading } = useSelector((state: any) => state.promotions);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionType | null>(null);

    useEffect(() => {
        dispatch(getPromotionsData());
    }, [dispatch]);

    const handleOpenModal = (promo: PromotionType | null = null) => {
        console.log("Open Modal for:", promo);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked for:", id);
    };

    return (
        <div className="promotions-page-container w-full h-full flex flex-col">
            <PromotionsSplitView
                promotions={promotions}
                selectedPromotion={selectedPromotion}
                setSelectedPromotion={setSelectedPromotion}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                loading={loading}
            />
        </div>
    );
};

export default Promotions;
