import { IState } from '../states';
import { QuotesState } from '../states/quotes';

export const getQuotesList = ({quotes}: IState): QuotesState => quotes;