import { createByIdLoader } from '../util';

export default ({ collections: { Files } }) => createByIdLoader(Files);
