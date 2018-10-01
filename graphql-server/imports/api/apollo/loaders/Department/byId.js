import { createByIdLoader } from '../util';

export default ({ collections: { Departments } }) => createByIdLoader(Departments);
