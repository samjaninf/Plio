import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, args, context) => {
  const { organizationId } = args;
  const { collections: { Features } } = context;
  const cursor = Features.find({ organizationId });

  return {
    totalCount: cursor.count(),
    features: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
