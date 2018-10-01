import { checkDocAccess } from '../document';

export default (config = () => ({})) =>
  checkDocAccess(async (root, args, context) => ({
    ...await config(root, args, context),
    collection: context.collections.CostLines,
  }));
