import CREATE_MILESTONE from './CreateMilestone.graphql';
import DELETE_MILESTONE from './DeleteMilestone.graphql';
import UPDATE_MILESTONE_TITLE from './UpdateMilestoneTitle.graphql';
import UPDATE_MILESTONE_DESCRIPTION from './UpdateMilestoneDescription.graphql';
import UPDATE_MILESTONE_COMPLETION_TARGET_DATE from './UpdateMilestoneCompletionTargetDate.graphql';
import COMPLETE_MILESTONE from './CompleteMilestone.graphql';
import UPDATE_MILESTONE_COMPLETED_AT from './UpdateMilestoneCompletedAt.graphql';
import UPDATE_MILESTONE_COMPLETION_COMMENT from './UpdateMilestoneCompletionComment.graphql';
import ADD_MILESTONE_NOTIFY_USER from './AddMilestoneNotifyUser.graphql';
import REMOVE_MILESTONE_NOTIFY_USER from './RemoveMilestoneNotifyUser.graphql';
import UPDATE_MILESTONE from './UpdateMilestone.graphql';

CREATE_MILESTONE.name = 'createMilestone';
DELETE_MILESTONE.name = 'deleteMilestone';
UPDATE_MILESTONE_TITLE.name = 'updateMilestoneTitle';
UPDATE_MILESTONE_DESCRIPTION.name = 'updateMilestoneDescription';
UPDATE_MILESTONE_COMPLETION_TARGET_DATE.name = 'updateMilestoneCompletionTargetDate';
COMPLETE_MILESTONE.name = 'completeMilestone';
UPDATE_MILESTONE_COMPLETED_AT.name = 'updateMilestoneCompletedAt';
UPDATE_MILESTONE_COMPLETION_COMMENT.name = 'updateMilestoneCompletionComment';
ADD_MILESTONE_NOTIFY_USER.name = 'addMilestoneNotifyUser';
REMOVE_MILESTONE_NOTIFY_USER.name = 'removeMilestoneNotifyUser';

export default {
  CREATE_MILESTONE,
  DELETE_MILESTONE,
  UPDATE_MILESTONE_TITLE,
  UPDATE_MILESTONE_DESCRIPTION,
  UPDATE_MILESTONE_COMPLETION_TARGET_DATE,
  COMPLETE_MILESTONE,
  UPDATE_MILESTONE_COMPLETED_AT,
  UPDATE_MILESTONE_COMPLETION_COMMENT,
  ADD_MILESTONE_NOTIFY_USER,
  REMOVE_MILESTONE_NOTIFY_USER,
  UPDATE_MILESTONE,
};
