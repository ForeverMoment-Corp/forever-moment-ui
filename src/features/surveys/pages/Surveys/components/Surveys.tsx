import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSurveysData } from '../../../store/actions';
import { SurveysSplitView } from './SurveysSplitView';

const Surveys = () => {
    const dispatch = useDispatch<any>();
    const { data: surveys, loading } = useSelector((state: any) => state.surveys);
    const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

    useEffect(() => {
        dispatch(getSurveysData());
    }, [dispatch]);

    return (
        <div className="surveys-page-container w-full h-full flex flex-col">
            <SurveysSplitView
                surveys={surveys}
                selectedSurvey={selectedSurvey}
                setSelectedSurvey={setSelectedSurvey}
                loading={loading}
            />
        </div>
    );
};

export default Surveys;
