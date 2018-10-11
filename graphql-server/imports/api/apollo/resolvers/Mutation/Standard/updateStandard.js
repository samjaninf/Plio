import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkStandardAccess,
  branch,
  checkOrgMembership,
  standardUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.StandardService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkStandardAccess(),
  branch(
    (root, args) => args.owner,
    checkOrgMembership(({ organizationId }, { owner }) => ({
      organizationId,
      userId: owner,
    })),
  ),
  standardUpdateAfterware(),
)(resolver);
