import { createQueryLoader } from '../util';

export default ({ collections: { Features } }, getLoaders) =>
  createQueryLoader(Features, (features) => {
    const { Feature: { byId } } = getLoaders();

    features.forEach(feature => byId.prime(feature._id, feature));

    return features;
  });
