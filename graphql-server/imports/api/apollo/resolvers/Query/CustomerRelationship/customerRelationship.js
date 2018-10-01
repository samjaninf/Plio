import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkCustomerRelationshipAccess } from '../../../../../share/middleware';

export const resolver = customerRelationship => ({ customerRelationship });

export default applyMiddleware(
  checkLoggedIn(),
  checkCustomerRelationshipAccess(),
)(resolver);
