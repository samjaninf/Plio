import { checkPercentField } from '../document';

export default (config = () => ({})) =>
  checkPercentField(async (root, args, context) => ({
    ...await config(root, args, context),
    collection: context.collections.RevenueStreams,
    key: 'percentOfRevenue',
    entityName: 'Revenue streams',
  }));
