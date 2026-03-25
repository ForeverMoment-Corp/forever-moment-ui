import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTicketsData } from '../../../store/actions';
import { HelpdeskSplitView } from './HelpdeskSplitView';

const Helpdesk = () => {
    const dispatch = useDispatch<any>();
    const { data: tickets, loading } = useSelector((state: any) => state.helpdesk);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    useEffect(() => {
        dispatch(getTicketsData());
    }, [dispatch]);

    return (
        <div className="helpdesk-page-container w-full h-full flex flex-col">
            <HelpdeskSplitView
                tickets={tickets}
                selectedTicket={selectedTicket}
                setSelectedTicket={setSelectedTicket}
                loading={loading}
            />
        </div>
    );
};

export default Helpdesk;
