import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyPartnerAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyPartnerService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyPartnerAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.KeyPartners,
  })),
)(resolver);
