import axios from '@/utils/Http';

export const fetchBookingsData = async () => {
    return await axios.get('/admin/bookings');
};
