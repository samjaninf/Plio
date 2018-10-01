import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkPercentOfTotalCost,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CostLineService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkPercentOfTotalCost(),
  insertAfterware((root, args, { collections: { CostLines } }) => ({
    collection: CostLines,
    key: 'costLine',
  })),
)(resolver);
