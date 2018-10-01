import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkPercentOfRevenue,
  checkPercentOfProfit,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.RevenueStreamService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkPercentOfRevenue(),
  checkPercentOfProfit(),
  insertAfterware((root, args, { collections: { RevenueStreams } }) => ({
    collection: RevenueStreams,
    key: 'revenueStream',
  })),
)(resolver);
