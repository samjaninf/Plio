import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkBenefitAccess,
  benefitUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.BenefitService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkBenefitAccess(),
  benefitUpdateAfterware(),
)(resolver);
