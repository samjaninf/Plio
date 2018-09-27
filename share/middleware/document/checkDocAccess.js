import { applyMiddleware } from 'plio-util';
import checkDocExistence from './checkDocExistence';
import checkOrgMembership from '../auth/checkOrgMembership';

export default (config = () => ({})) => async (next, root, args, context) => {
  const configuration = await config(root, args, context);

  return applyMiddleware(
    checkDocExistence(() => configuration),
    checkOrgMembership(async ({ organizationId }) => ({
      organizationId,
      ...configuration,
    })),
  )(next)(root, args, context);
};
