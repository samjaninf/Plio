import { createByIdLoader } from '../util';

export default ({ collections: { Users } }) => createByIdLoader(Users);
