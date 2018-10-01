import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerSegmentAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerSegmentAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.CustomerSegments,
  })),
)(resolver);
