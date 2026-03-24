import { useState, useEffect } from 'react';
import { BookingsSplitView } from './BookingsSplitView';
import '../../css/styles.scss';

export interface BookingType {
    id: string;
    customerName: string;
    eventName: string;
    date: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    amount: number;
}

const DUMMY_BOOKINGS: BookingType[] = [
    { id: 'BKG-1001', customerName: 'John Doe', eventName: 'Wedding Photography', date: '2026-04-10', status: 'Confirmed', amount: 1500 },
    { id: 'BKG-1002', customerName: 'Jane Smith', eventName: 'Birthday Party', date: '2026-04-15', status: 'Pending', amount: 500 },
    { id: 'BKG-1003', customerName: 'Alice Johnson', eventName: 'Corporate Event', date: '2026-05-02', status: 'Cancelled', amount: 2000 },
    { id: 'BKG-1004', customerName: 'Bob Williams', eventName: 'Pre-wedding Shoot', date: '2026-05-10', status: 'Confirmed', amount: 800 },
    { id: 'BKG-1005', customerName: 'Emma Brown', eventName: 'Anniversary Celebration', date: '2026-06-20', status: 'Pending', amount: 1200 },
];

interface BookingsProps {
    loading: boolean;
    error: any;
    getBookingsData: () => void;
}

const Bookings = ({
    loading,
    getBookingsData,
}: BookingsProps) => {
    const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);

    // Initial fetch
    useEffect(() => {
        getBookingsData();
    }, [getBookingsData]);

    const handleOpenModal = (booking: BookingType | null = null) => {
        // Modal placeholder logic
        console.log("Open Modal for:", booking);
    };

    const handleDeleteClick = (id: string | number) => {
        console.log("Delete clicked for:", id);
    };

    return (
        <div className="bookings-page-container w-full h-full flex flex-col">
            <BookingsSplitView
                bookings={DUMMY_BOOKINGS}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedBooking={selectedBooking}
                setSelectedBooking={setSelectedBooking}
                loading={loading}
            />
        </div>
    );
};

export default Bookings;
