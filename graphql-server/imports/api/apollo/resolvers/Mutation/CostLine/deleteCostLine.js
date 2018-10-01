import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCostLineAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CostLineService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCostLineAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.CostLines,
  })),
)(resolver);
