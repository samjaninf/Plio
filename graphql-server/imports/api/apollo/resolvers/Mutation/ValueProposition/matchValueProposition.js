import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkValuePropositionAccess,
  valuePropositionUpdateAfterware,
  branch,
  checkDocAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.match(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkValuePropositionAccess(),
  branch(
    (root, args) => args.matchedTo,
    checkDocAccess((root, { matchedTo: { documentId } }, context) => ({
      query: { _id: documentId },
      collection: context.collections.CustomerSegments,
    })),
  ),
  valuePropositionUpdateAfterware(),
)(resolver);
