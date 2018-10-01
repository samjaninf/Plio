import { pluck } from 'ramda';
import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  insertAfterware,
  checkDocsAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.BenefitService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkDocsAccess(async (root, { linkedTo }, { collections: { ValuePropositions } }) => ({
    collection: ValuePropositions,
    ids: pluck('documentId', linkedTo),
  })),
  insertAfterware((root, args, { collections: { Benefits } }) => ({
    collection: Benefits,
    key: 'benefit',
  })),
)(resolver);
