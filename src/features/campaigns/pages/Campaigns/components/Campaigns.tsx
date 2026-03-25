import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCampaignsData } from '../../../store/actions';
import { CampaignsSplitView } from './CampaignsSplitView';

const Campaigns = () => {
    const dispatch = useDispatch<any>();
    const { data: campaigns, loading } = useSelector((state: any) => state.campaigns);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

    useEffect(() => {
        dispatch(getCampaignsData());
    }, [dispatch]);

    return (
        <div className="campaigns-page-container w-full h-full flex flex-col">
            <CampaignsSplitView
                campaigns={campaigns}
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                loading={loading}
            />
        </div>
    );
};

export default Campaigns;
