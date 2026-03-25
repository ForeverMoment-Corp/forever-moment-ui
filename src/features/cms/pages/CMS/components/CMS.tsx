import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCMSData } from '../../../store/actions';
import { CMSSplitView } from './CMSSplitView';

const CMS = () => {
    const dispatch = useDispatch<any>();
    const { data: pages, loading } = useSelector((state: any) => state.cms);
    const [selectedPage, setSelectedPage] = useState<any>(null);

    useEffect(() => {
        dispatch(getCMSData());
    }, [dispatch]);

    return (
        <div className="cms-page-container w-full h-full flex flex-col">
            <CMSSplitView
                pages={pages}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                loading={loading}
            />
        </div>
    );
};

export default CMS;
