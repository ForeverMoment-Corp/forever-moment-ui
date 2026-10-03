import { connect } from 'react-redux';
import { getFaqData, createFaq, updateFaq, deleteFaq, toggleFaq, reorderFaq } from '@/features/faq/store/actions';
import Faq from './components/Faq';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.faq.data,
    loading: state.faq.loading,
    error: state.faq.error,
});

const mapDispatchToProps = {
    getFaqData,
    createFaq,
    updateFaq,
    deleteFaq,
    toggleFaq,
    reorderFaq,
};

export default connect(mapStateToProps, mapDispatchToProps)(Faq);
