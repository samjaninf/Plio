import { createByIdLoader } from '../util';

export default ({ collections: { StandardsBookSections } }) =>
  createByIdLoader(StandardsBookSections);
