import { createQueryLoader } from '../util';

export default ({ collections: { Milestones } }, getLoaders) =>
  createQueryLoader(Milestones, (milestones) => {
    const { Milestone: { byId } } = getLoaders();

    milestones.forEach(milestone => byId.prime(milestone._id, milestone));

    return milestones;
  });
