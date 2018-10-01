import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRevenueStreamAccess,
  checkPercentOfRevenue,
  checkPercentOfProfit,
  checkFilesAccess,
  revenueStreamUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.RevenueStreamService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRevenueStreamAccess(),
  checkPercentOfRevenue(),
  checkPercentOfProfit(),
  checkFilesAccess(),
  revenueStreamUpdateAfterware(),
)(resolver);
