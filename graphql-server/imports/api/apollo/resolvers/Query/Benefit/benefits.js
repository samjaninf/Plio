import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, args, context) => {
  const { organizationId } = args;
  const { collections: { Benefits } } = context;
  const cursor = Benefits.find({ organizationId });

  return {
    totalCount: cursor.count(),
    benefits: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
