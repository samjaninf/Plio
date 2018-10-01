import { CustomerElementService } from './internal';

export default {
  ...CustomerElementService,
  collection: ({ collections: { Needs } }) => Needs,
};
