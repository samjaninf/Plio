import { createQueryLoader } from '../util';

export default ({ collections: { Wants } }, getLoaders) =>
  createQueryLoader(Wants, (wants) => {
    const { Want: { byId } } = getLoaders();

    wants.forEach(want => byId.prime(want._id, want));

    return wants;
  });
