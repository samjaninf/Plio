import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkKeyActivityAccess } from '../../../../../share/middleware';

export const resolver = keyActivity => ({ keyActivity });

export default applyMiddleware(
  checkLoggedIn(),
  checkKeyActivityAccess(),
)(resolver);
