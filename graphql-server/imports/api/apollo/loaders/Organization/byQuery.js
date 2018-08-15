import { createQueryLoader } from '../util';

export default ({ collections: { Organizations } }, getLoaders) =>
  createQueryLoader(Organizations, (organizations) => {
    const { Organization: { byId } } = getLoaders();

    organizations.forEach(organization => byId.prime(organization._id, organization));

    return organizations;
  });
