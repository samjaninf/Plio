import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkCustomerSegmentAccess } from '../../../../../share/middleware';

export const resolver = customerSegment => ({ customerSegment });

export default applyMiddleware(
  checkLoggedIn(),
  checkCustomerSegmentAccess(),
)(resolver);
