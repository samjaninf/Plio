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
  context.services.WantService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkDocsAccess(async (root, { linkedTo }, { collections: { CustomerSegments } }) => ({
    collection: CustomerSegments,
    ids: pluck('documentId', linkedTo),
  })),
  insertAfterware((root, args, { collections: { Wants } }) => ({
    collection: Wants,
    key: 'want',
  })),
)(resolver);
