import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkValuePropositionAccess,
  checkFilesAccess,
  valuePropositionUpdateAfterware,
  checkValuePropositionMatchedToAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkValuePropositionAccess(),
  checkValuePropositionMatchedToAccess(),
  checkFilesAccess(),
  valuePropositionUpdateAfterware(),
)(resolver);
