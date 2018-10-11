import { createByIdLoader } from '../util';

export default ({ collections: { StandardTypes } }) => createByIdLoader(StandardTypes);
