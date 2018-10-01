import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, args, context) => {
  const { organizationId } = args;
  const { collections: { Wants } } = context;
  const cursor = Wants.find({ organizationId });

  return {
    totalCount: cursor.count(),
    wants: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
