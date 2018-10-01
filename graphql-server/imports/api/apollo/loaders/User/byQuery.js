import { createQueryLoader } from '../util';

export default ({ collections: { Users } }, getLoaders) =>
  createQueryLoader(Users, (users) => {
    const { User: { byId } } = getLoaders();

    users.forEach(user => byId.prime(user._id, user));

    return users;
  });
