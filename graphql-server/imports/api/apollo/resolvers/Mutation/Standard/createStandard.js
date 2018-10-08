import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { StandardService } }) =>
  StandardService.insert(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  insertAfterware((root, args, { collections: { Standards } }) => ({
    collection: Standards,
    key: 'standard',
  })),
)(resolver);
