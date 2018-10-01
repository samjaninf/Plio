import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerRelationshipService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  insertAfterware((root, args, { collections: { CustomerRelationships } }) => ({
    collection: CustomerRelationships,
    key: 'customerRelationship',
  })),
)(resolver);
