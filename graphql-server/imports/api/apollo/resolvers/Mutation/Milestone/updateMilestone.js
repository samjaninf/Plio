import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  milestoneUpdateAfterware,
  branch,
  checkMilestoneCompletionTargetDate,
  ensureIsCompleted,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.MilestoneService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  branch(
    (root, args) => args.completionTargetDate,
    checkMilestoneCompletionTargetDate(),
  ),
  branch(
    (root, args) => args.completedAt || args.completionComments,
    ensureIsCompleted(),
  ),
  // TODO: check notify users access
  milestoneUpdateAfterware(),
)(resolver);
