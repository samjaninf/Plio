import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCostLineAccess,
  checkPercentOfTotalCost,
  checkFilesAccess,
  costLineUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CostLineService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCostLineAccess(),
  checkPercentOfTotalCost(),
  checkFilesAccess(),
  costLineUpdateAfterware(),
)(resolver);
