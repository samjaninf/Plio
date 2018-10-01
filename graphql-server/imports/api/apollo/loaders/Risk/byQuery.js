import { createQueryLoader } from '../util';

export default ({ collections: { Risks } }, getLoaders) => createQueryLoader(Risks, (risks) => {
  const { Risk: { byId } } = getLoaders();

  risks.forEach(risk => byId.prime(risk._id, risk));

  return risks;
});
