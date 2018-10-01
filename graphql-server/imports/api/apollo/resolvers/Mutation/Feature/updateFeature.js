import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkFeatureAccess,
  featureUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.FeatureService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkFeatureAccess(),
  featureUpdateAfterware(),
)(resolver);
