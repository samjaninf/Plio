import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkChannelAccess } from '../../../../../share/middleware';

export const resolver = channel => ({ channel });

export default applyMiddleware(
  checkLoggedIn(),
  checkChannelAccess(),
)(resolver);
