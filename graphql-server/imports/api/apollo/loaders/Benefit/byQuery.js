import { createQueryLoader } from '../util';

export default ({ collections: { Benefits } }, getLoaders) =>
  createQueryLoader(Benefits, (benefits) => {
    const { Benefit: { byId } } = getLoaders();

    benefits.forEach(benefit => byId.prime(benefit._id, benefit));

    return benefits;
  });
