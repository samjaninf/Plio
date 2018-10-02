import COMPLETE_GOAL from './CompleteGoal.graphql';
import UNDO_GOAL_COMPLETION from './UndoGoalCompletion.graphql';
import DELETE_GOAL from './DeleteGoal.graphql';
import RESTORE_GOAL from './RestoreGoal.graphql';
import REMOVE_GOAL from './RemoveGoal.graphql';
import LINK_RISK_TO_GOAL from './LinkRiskToGoal.graphql';
import CREATE_GOAL from './CreateGoal.graphql';
import ADD_GOAL_NOTIFY_USER from './AddGoalNotifyUser.graphql';
import REMOVE_GOAL_NOTIFY_USER from './RemoveGoalNotifyUser.graphql';
import UPDATE_GOAL from './UpdateGoal.graphql';

ADD_GOAL_NOTIFY_USER.name = 'addGoalNotifyUser';
REMOVE_GOAL_NOTIFY_USER.name = 'removeGoalNotifyUser';
UNDO_GOAL_COMPLETION.name = 'undoGoalCompletion';
RESTORE_GOAL.name = 'restoreGoal';
REMOVE_GOAL.name = 'removeGoal';

export default {
  COMPLETE_GOAL,
  UNDO_GOAL_COMPLETION,
  DELETE_GOAL,
  RESTORE_GOAL,
  REMOVE_GOAL,
  LINK_RISK_TO_GOAL,
  CREATE_GOAL,
  ADD_GOAL_NOTIFY_USER,
  REMOVE_GOAL_NOTIFY_USER,
  UPDATE_GOAL,
};
