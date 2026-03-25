import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewsData } from '../../../store/actions';
import { ReviewsSplitView } from './ReviewsSplitView';

export interface ReviewType {
    id: string;
    customerName: string;
    experienceName: string;
    rating: number;
    comment: string;
    status: 'Pending' | 'Approved' | 'Hidden';
    date: string;
}

const Reviews = () => {
    const dispatch = useDispatch<any>();
    const { data: reviews, loading } = useSelector((state: any) => state.reviews);
    const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);

    useEffect(() => {
        dispatch(getReviewsData());
    }, [dispatch]);

    const handleOpenModal = (review: ReviewType | null = null) => {
        console.log("Open Modal for:", review);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked for:", id);
    };

    return (
        <div className="reviews-page-container w-full h-full flex flex-col">
            <ReviewsSplitView
                reviews={reviews}
                selectedReview={selectedReview}
                setSelectedReview={setSelectedReview}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                loading={loading}
            />
        </div>
    );
};

export default Reviews;
