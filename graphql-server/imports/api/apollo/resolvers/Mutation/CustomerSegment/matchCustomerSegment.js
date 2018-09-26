import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerSegmentAccess,
  customerSegmentUpdateAfterware,
  checkCustomerSegmentMatchedToAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.match(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerSegmentAccess(),
  checkCustomerSegmentMatchedToAccess(),
  customerSegmentUpdateAfterware(),
)(resolver);
