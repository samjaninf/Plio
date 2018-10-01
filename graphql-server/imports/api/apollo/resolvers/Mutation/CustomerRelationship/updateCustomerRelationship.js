import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerRelationshipAccess,
  checkFilesAccess,
  customerRelationshipUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerRelationshipService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerRelationshipAccess(),
  checkFilesAccess(),
  customerRelationshipUpdateAfterware(),
)(resolver);
