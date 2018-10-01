import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkValuePropositionAccess } from '../../../../../share/middleware';

export const resolver = valueProposition => ({ valueProposition });

export default applyMiddleware(
  checkLoggedIn(),
  checkValuePropositionAccess(),
)(resolver);
