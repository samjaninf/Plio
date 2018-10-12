import CREATE_MILESTONE from './CreateMilestone.graphql';
import DELETE_MILESTONE from './DeleteMilestone.graphql';
import COMPLETE_MILESTONE from './CompleteMilestone.graphql';
import UPDATE_MILESTONE from './UpdateMilestone.graphql';

CREATE_MILESTONE.name = 'createMilestone';
DELETE_MILESTONE.name = 'deleteMilestone';
COMPLETE_MILESTONE.name = 'completeMilestone';

export default {
  CREATE_MILESTONE,
  DELETE_MILESTONE,
  COMPLETE_MILESTONE,
  UPDATE_MILESTONE,
};
