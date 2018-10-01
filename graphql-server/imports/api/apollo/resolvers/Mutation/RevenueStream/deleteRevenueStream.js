import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRevenueStreamAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.RevenueStreamService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRevenueStreamAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.RevenueStreams,
  })),
)(resolver);
