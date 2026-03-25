import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRefundsData } from '../../../store/actions';
import { RefundsSplitView } from './RefundsSplitView';

const Refunds = () => {
    const dispatch = useDispatch<any>();
    const { data: refunds, loading } = useSelector((state: any) => state.refunds);
    const [selectedRefund, setSelectedRefund] = useState<any>(null);

    useEffect(() => {
        dispatch(getRefundsData());
    }, [dispatch]);

    return (
        <div className="refunds-page-container w-full h-full flex flex-col">
            <RefundsSplitView
                refunds={refunds}
                selectedRefund={selectedRefund}
                setSelectedRefund={setSelectedRefund}
                loading={loading}
            />
        </div>
    );
};

export default Refunds;
