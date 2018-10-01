import { createByIdLoader } from '../util';

export default ({ collections: { Organizations } }) => createByIdLoader(Organizations);
