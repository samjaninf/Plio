import { curry } from 'ramda';

import { swal } from '../../util';
import {
  moveGoalWithinCacheAfterDeleting,
  moveGoalWithinCacheAfterRestoring,
  moveGoalWithinCacheAfterRemoving,
} from '../../apollo/utils';
import { Mutation } from '../../graphql';

export const onDelete = ({ mutate, ownProps: { organizationId, goal } }, callback) => swal.promise({
  text: `The goal "${goal.title}" will be deleted`,
  confirmButtonText: 'Delete',
  successTitle: 'Deleted!',
  successText: `The key goal "${goal.title}" was deleted successfully.`,
}, () => mutate({
  variables: {
    input: {
      _id: goal._id,
    },
  },
  update: (proxy, { data: { deleteGoal: removedGoal } }) => {
    if (!removedGoal.isCompleted) {
      moveGoalWithinCacheAfterDeleting(organizationId, removedGoal, proxy);
    }
  },
}).then(callback));

export const onComplete = ({ mutate, ownProps: { organizationId, goal } }) => mutate({
  variables: {
    input: {
      _id: goal._id,
    },
  },
  update: (proxy, { data: { completeGoal: completedGoal } }) => {
    moveGoalWithinCacheAfterDeleting(organizationId, completedGoal, proxy);
  },
});

export const createRestoreHandler = curry((
  mutationName,
  { [mutationName]: mutate, organizationId },
) => ({ _id, title }) => swal.promise({
  text: `The key goal "${title}" will be restored!`,
  confirmButtonText: 'Restore',
  successTitle: 'Restored!',
  successText: `The key goal "${title}" was restored successfully.`,
}, () => mutate({
  variables: { input: { _id } },
  update: (store, { data: { [mutationName]: goal } }) => {
    moveGoalWithinCacheAfterRestoring(organizationId, goal, store);
  },
})));

export const onRemove = ({ organizationId, [Mutation.REMOVE_GOAL.name]: mutate }) =>
  ({ _id, title }) => swal.promise({
    text: `The goal "${title}" will be deleted permanently`,
    confirmButtonText: 'Delete',
    successTitle: 'Deleted!',
    successText: `The key goal "${title}" was removed successfully.`,
  }, () => mutate({
    variables: { input: { _id } },
    update: (store) => {
      moveGoalWithinCacheAfterRemoving(organizationId, _id, store);
    },
  }));
