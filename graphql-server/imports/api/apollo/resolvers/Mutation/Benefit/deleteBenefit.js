import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkBenefitAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.BenefitService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkBenefitAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Benefits,
  })),
)(resolver);
