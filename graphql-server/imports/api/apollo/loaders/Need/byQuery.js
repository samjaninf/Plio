import { createQueryLoader } from '../util';

export default ({ collections: { Needs } }, getLoaders) =>
  createQueryLoader(Needs, (needs) => {
    const { Need: { byId } } = getLoaders();

    needs.forEach(need => byId.prime(need._id, need));

    return needs;
  });
