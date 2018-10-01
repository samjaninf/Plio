import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkValuePropositionAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkValuePropositionAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.ValuePropositions,
  })),
)(resolver);
