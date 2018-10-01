import { CustomerElementService } from './internal';

export default {
  ...CustomerElementService,
  collection: ({ collections: { Wants } }) => Wants,
};
