import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyActivityService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  insertAfterware((root, args, { collections: { KeyActivities } }) => ({
    collection: KeyActivities,
    key: 'keyActivity',
  })),
)(resolver);
