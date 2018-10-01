import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureCanChangeOrgSettings,
  organizationUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.OrganizationService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  ensureCanChangeOrgSettings(((root, { _id }) => ({
    organizationId: _id,
  }))),
  organizationUpdateAfterware(),
)(resolver);
