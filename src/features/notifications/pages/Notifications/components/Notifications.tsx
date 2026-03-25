import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsData } from '../../../store/actions';
import { NotificationsSplitView } from './NotificationsSplitView';

const Notifications = () => {
    const dispatch = useDispatch<any>();
    const { data: notifications, loading } = useSelector((state: any) => state.notifications);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);

    useEffect(() => {
        dispatch(getNotificationsData());
    }, [dispatch]);

    return (
        <div className="notifications-page-container w-full h-full flex flex-col">
            <NotificationsSplitView
                notifications={notifications}
                selectedNotification={selectedNotification}
                setSelectedNotification={setSelectedNotification}
                loading={loading}
            />
        </div>
    );
};

export default Notifications;
