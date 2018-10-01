import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, args, context) => {
  const { organizationId } = args;
  const { collections: { Needs } } = context;
  const cursor = Needs.find({ organizationId });

  return {
    totalCount: cursor.count(),
    needs: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
