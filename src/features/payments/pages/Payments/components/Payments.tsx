import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentsData } from '../../../store/actions';
import { PaymentsSplitView } from './PaymentsSplitView';

export interface PaymentType {
    id: string;
    bookingId: string;
    customerName: string;
    amount: number;
    method: 'Credit Card' | 'UPI' | 'Net Banking' | 'Cash';
    status: 'Captured' | 'Pending' | 'Refunded' | 'Failed';
    date: string;
}

const Payments = () => {
    const dispatch = useDispatch<any>();
    const { data: payments, loading } = useSelector((state: any) => state.payments);
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

    useEffect(() => {
        dispatch(getPaymentsData());
    }, [dispatch]);

    const handleOpenModal = (payment: PaymentType | null = null) => {
        console.log("Open Modal for:", payment);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked for:", id);
    };

    return (
        <div className="payments-page-container w-full h-full flex flex-col">
            <PaymentsSplitView
                payments={payments}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                loading={loading}
            />
        </div>
    );
};

export default Payments;
