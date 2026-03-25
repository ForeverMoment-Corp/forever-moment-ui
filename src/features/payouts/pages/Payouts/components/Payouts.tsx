import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayoutsData } from '../../../store/actions';
import { PayoutsSplitView } from './PayoutsSplitView';

const Payouts = () => {
    const dispatch = useDispatch<any>();
    const { data: payouts, loading } = useSelector((state: any) => state.payouts);
    const [selectedPayout, setSelectedPayout] = useState<any>(null);

    useEffect(() => {
        dispatch(getPayoutsData());
    }, [dispatch]);

    const handleOpenModal = (item: any = null) => {
        console.log("Open Modal for:", item);
    };

    return (
        <div className="payouts-page-container w-full h-full flex flex-col">
            <PayoutsSplitView
                payouts={payouts}
                selectedPayout={selectedPayout}
                setSelectedPayout={setSelectedPayout}
                handleOpenModal={handleOpenModal}
                loading={loading}
            />
        </div>
    );
};

export default Payouts;
