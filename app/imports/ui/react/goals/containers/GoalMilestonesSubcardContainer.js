import { graphql } from 'react-apollo';
import { Cache } from 'plio-util';
import { FORM_ERROR } from 'final-form';

import GoalMilestonesSubcard from '../components/GoalMilestonesSubcard';
import { Mutation, Fragment } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { swal } from '../../../../client/util';
import { updateGoalFragment } from '../../../../client/apollo';

export default namedCompose('GoalMilestonesSubcardContainer')(
  graphql(Mutation.CREATE_MILESTONE, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        linkedTo,
      },
    }) => ({
      onSave: async (
        {
          title,
          description,
          completionTargetDate,
        },
        {
          ownProps: { flush },
        },
      ) => {
        const errors = [];

        if (!title) errors.push('Title is required');
        if (!completionTargetDate) errors.push('Completion - target date is required');

        if (errors.length) return { [FORM_ERROR]: errors.join('\n') };

        try {
          const { data } = await mutate({
            variables: {
              input: {
                title,
                description,
                completionTargetDate,
                organizationId,
                linkedTo: linkedTo._id,
              },
            },
            update: (proxy, { data: { createMilestone: { milestone } } }) => updateGoalFragment(
              Cache.addMilestone(milestone),
              {
                id: linkedTo._id,
                fragment: Fragment.GOAL_CARD,
              },
              proxy,
            ),
          });
          const { createMilestone: { milestone } } = data;

          return flush(milestone);
        } catch ({ message }) {
          return { [FORM_ERROR]: message };
        }
      },
    }),
  }),
  graphql(Mutation.DELETE_MILESTONE, {
    props: ({
      mutate,
      ownProps: {
        linkedTo = {},
      },
    }) => ({
      onDelete: (e, {
        entity: { _id, title },
      }) => swal.promise({
        text: `The milestone "${title}" will be deleted`,
        confirmButtonText: 'Delete',
      }, () => mutate({
        variables: {
          input: { _id },
        },
        update: updateGoalFragment(Cache.deleteMilestoneById(_id), {
          id: linkedTo._id,
          fragment: Fragment.GOAL_CARD,
        }),
      })),
    }),
  }),
)(GoalMilestonesSubcard);
