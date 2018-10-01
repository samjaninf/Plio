import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  insertAfterware,
  checkValuePropositionMatchedToAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkValuePropositionMatchedToAccess(),
  insertAfterware((root, args, { collections: { ValuePropositions } }) => ({
    collection: ValuePropositions,
    key: 'valueProposition',
  })),
)(resolver);
