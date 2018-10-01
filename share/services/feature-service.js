import { CustomerElementService } from './internal';

export default {
  ...CustomerElementService,
  collection: ({ collections: { Features } }) => Features,
};
