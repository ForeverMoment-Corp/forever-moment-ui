import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWaitlistData } from '../../../store/actions';
import { WaitlistSplitView } from './WaitlistSplitView';

const Waitlist = () => {
    const dispatch = useDispatch<any>();
    const { data: waitlist, loading } = useSelector((state: any) => state.waitlist);
    const [selectedEntry, setSelectedEntry] = useState<any>(null);

    useEffect(() => {
        dispatch(getWaitlistData());
    }, [dispatch]);

    return (
        <div className="waitlist-page-container w-full h-full flex flex-col">
            <WaitlistSplitView
                waitlist={waitlist}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
                loading={loading}
            />
        </div>
    );
};

export default Waitlist;
