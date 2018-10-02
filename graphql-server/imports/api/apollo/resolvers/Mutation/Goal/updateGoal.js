import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  checkFilesAccess,
  branch,
  checkOrgMembership,
  ensureCanUpdateStartDate,
  ensureCanUpdateEndDate,
  ensureCanChangeGoals,
  checkDocsAccess,
  goalUpdateAfterware,
  composeMiddleware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GoalService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkFilesAccess(),
  branch(
    (root, args) => args.ownerId,
    checkOrgMembership(({ organizationId }, { ownerId }) => ({
      organizationId,
      userId: ownerId,
    })),
  ),
  branch(
    (root, args) => args.startDate,
    ensureCanUpdateStartDate(),
  ),
  branch(
    (root, args) => args.endDate,
    ensureCanUpdateEndDate(),
  ),
  branch(
    (root, args) => args.completedBy,
    checkOrgMembership(({ organizationId }, { completedBy }) => ({
      organizationId,
      userId: completedBy,
    })),
  ),
  branch(
    (root, args) => args.milestoneIds,
    checkDocsAccess((root, { milestoneIds }, { collections: { Milestones } }) => ({
      ids: milestoneIds,
      collection: Milestones,
    })),
  ),
  branch(
    (root, args) => args.riskIds,
    composeMiddleware(
      ensureCanChangeGoals(),
      checkDocsAccess((root, { riskIds }, { collections: { Risks } }) => ({
        ids: riskIds,
        collection: Risks,
      })),
    ),
  ),
  // TODO: check notify users access
  goalUpdateAfterware(),
)(resolver);
