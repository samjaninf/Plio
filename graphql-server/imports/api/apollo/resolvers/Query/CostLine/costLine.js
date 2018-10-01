import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkCostLineAccess } from '../../../../../share/middleware';

export const resolver = costLine => ({ costLine });

export default applyMiddleware(
  checkLoggedIn(),
  checkCostLineAccess(),
)(resolver);
