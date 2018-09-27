import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
  checkRelationsAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.RelationService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRelationsAccess(),
  async (next, root, args, context) => {
    await next(root, args, context);

    return null;
  },
)(resolver);
