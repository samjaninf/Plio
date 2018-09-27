import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkPercentOfMarketSize,
  insertAfterware,
  checkCustomerSegmentMatchedToAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkPercentOfMarketSize(),
  checkCustomerSegmentMatchedToAccess(),
  insertAfterware((root, args, { collections: { CustomerSegments } }) => ({
    collection: CustomerSegments,
    key: 'customerSegment',
  })),
)(resolver);
