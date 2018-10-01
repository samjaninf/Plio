import { createQueryLoader } from '../util';

export default ({ collections: { Goals } }, getLoaders) => createQueryLoader(Goals, (goals) => {
  const { Goal: { byId } } = getLoaders();

  goals.forEach(goal => byId.prime(goal._id, goal));

  return goals;
});
