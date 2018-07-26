import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CanvasSettingsService.reorderItems(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
)(resolver);
