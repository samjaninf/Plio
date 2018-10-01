import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkRevenueStreamAccess } from '../../../../../share/middleware';

export const resolver = revenueStream => ({ revenueStream });

export default applyMiddleware(
  checkLoggedIn(),
  checkRevenueStreamAccess(),
)(resolver);
