import { createByIdLoader } from '../util';

export default ({ collections: { Goals } }) => createByIdLoader(Goals);
