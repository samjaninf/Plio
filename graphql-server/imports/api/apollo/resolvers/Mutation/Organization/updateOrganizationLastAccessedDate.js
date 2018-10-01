import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  organizationUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, { _id }, context) =>
  context.services.OrganizationService.update(
    { _id, lastAccessedDate: new Date() },
    context,
  );

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership((root, { _id }) => ({ organizationId: _id })),
  organizationUpdateAfterware(),
)(resolver);
