import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomersData } from '../../../store/actions';
import { CustomersSplitView } from './CustomersSplitView';

export interface CustomerType {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    totalSpent: number;
    status: 'Active' | 'Inactive' | 'VIP';
    joinDate: string;
}

const Customers = () => {
    const dispatch = useDispatch<any>();
    const { data: customers, loading } = useSelector((state: any) => state.customers);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);

    useEffect(() => {
        dispatch(getCustomersData());
    }, [dispatch]);

    const handleOpenModal = (customer: CustomerType | null = null) => {
        console.log("Open Modal for:", customer);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked for:", id);
    };

    return (
        <div className="customers-page-container w-full h-full flex flex-col">
            <CustomersSplitView
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                loading={loading}
            />
        </div>
    );
};

export default Customers;
