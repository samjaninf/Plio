import { createQueryLoader } from '../util';

export default ({ collections: { Relations } }) => createQueryLoader(Relations);
