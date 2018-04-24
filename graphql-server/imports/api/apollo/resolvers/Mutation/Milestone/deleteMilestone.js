import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkMilestoneAccess,
  flattenInput,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.remove(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkMilestoneAccess(),
)(resolver);
