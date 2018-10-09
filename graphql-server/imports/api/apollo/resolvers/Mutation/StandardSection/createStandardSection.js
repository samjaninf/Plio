import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.StandardSectionService.insert(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  insertAfterware((root, args, { collections: { StandardsBookSections } }) => ({
    collection: StandardsBookSections,
    key: 'standardSection',
  })),
)(resolver);
