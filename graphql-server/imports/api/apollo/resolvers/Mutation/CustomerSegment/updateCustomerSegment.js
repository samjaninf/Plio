import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerSegmentAccess,
  checkPercentOfMarketSize,
  checkFilesAccess,
  customerSegmentUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerSegmentAccess(),
  checkPercentOfMarketSize(),
  checkFilesAccess(),
  customerSegmentUpdateAfterware(),
)(resolver);
