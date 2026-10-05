import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogsData } from '../../../store/actions';
import { LogsSplitView } from './LogsSplitView';

const Logs = () => {
    const dispatch = useDispatch<any>();
    const { data: logs, loading } = useSelector((state: any) => state.logs);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    useEffect(() => {
        dispatch(getLogsData());
    }, [dispatch]);

    return (
        <div className="activity-logs-page-container w-full h-full flex flex-col">
            <LogsSplitView
                logs={logs}
                selectedLog={selectedLog}
                setSelectedLog={setSelectedLog}
                loading={loading}
            />
        </div>
    );
};

export default Logs;
