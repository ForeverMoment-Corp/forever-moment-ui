import { connect } from 'react-redux';
import {
    getBookingsData,
    resetStatus,
} from '@/features/bookings/store/actions';
import Bookings from './components/Bookings';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: (state as any).bookings ? (state as any).bookings.data : null,
    loading: (state as any).bookings ? (state as any).bookings.loading : false,
    error: (state as any).bookings ? (state as any).bookings.error : null,
    status: (state as any).bookings ? (state as any).bookings.status : 'IDLE',
});

const mapDispatchToProps = {
    getBookingsData,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
