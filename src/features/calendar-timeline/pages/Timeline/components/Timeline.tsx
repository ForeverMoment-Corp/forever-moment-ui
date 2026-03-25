import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTimelineData } from '../../../store/actions';
import { TimelineSplitView } from './TimelineSplitView';

const Timeline = () => {
    const dispatch = useDispatch<any>();
    const { data: events, loading } = useSelector((state: any) => state.timeline);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        dispatch(getTimelineData());
    }, [dispatch]);

    return (
        <div className="timeline-page-container w-full h-full flex flex-col">
            <TimelineSplitView
                events={events}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                loading={loading}
            />
        </div>
    );
};

export default Timeline;
