import { CustomerElementService } from './internal';

export default {
  ...CustomerElementService,
  collection: ({ collections: { Benefits } }) => Benefits,
};

