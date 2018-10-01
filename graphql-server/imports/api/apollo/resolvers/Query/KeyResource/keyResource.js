import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkKeyResourceAccess } from '../../../../../share/middleware';

export const resolver = keyResource => ({ keyResource });

export default applyMiddleware(
  checkLoggedIn(),
  checkKeyResourceAccess(),
)(resolver);
