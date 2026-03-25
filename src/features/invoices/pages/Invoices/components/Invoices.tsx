import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoicesData } from '../../../store/actions';
import { InvoicesSplitView } from './InvoicesSplitView';

const Invoices = () => {
    const dispatch = useDispatch<any>();
    const { data: invoices, loading } = useSelector((state: any) => state.invoices);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    useEffect(() => {
        dispatch(getInvoicesData());
    }, [dispatch]);

    return (
        <div className="invoices-page-container w-full h-full flex flex-col">
            <InvoicesSplitView
                invoices={invoices}
                selectedInvoice={selectedInvoice}
                setSelectedInvoice={setSelectedInvoice}
                loading={loading}
            />
        </div>
    );
};

export default Invoices;
