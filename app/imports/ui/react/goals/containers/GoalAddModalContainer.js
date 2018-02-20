import connectUI from 'redux-ui';
import { lenses } from 'plio-util';
import { view, over, compose, append, inc } from 'ramda';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { namedCompose } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { GoalPriorities } from '../../../../share/constants';
import { Query, Fragment } from '../../../../client/graphql';
import { callAsync } from '../../components/Modal';

const addGoal = (goal, data) => compose(
  over(lenses.goals.goals, append(goal)),
  over(lenses.goals.totalCount, inc),
)(data);

const CREATE_GOAL = gql`
  mutation createGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      goal {
        ...DashboardGoal
      }
    }
  }
  ${Fragment.DASHBOARD_GOAL}
`;

export default namedCompose('GoalAddModalContainer')(
  connect(),
  connectUI({
    state: {
      title: '',
      description: '',
      ownerId: view(lenses.ownerId),
      startDate: () => new Date(),
      endDate: null,
      priority: GoalPriorities.MINOR,
      color: '',
    },
  }),
  graphql(CREATE_GOAL, {
    props: ({
      mutate,
      ownProps: {
        ui: {
          title,
          description,
          ownerId,
          startDate,
          endDate,
          priority,
          color = '',
        },
        organizationId,
        toggle,
        isOpen,
        dispatch,
        updateUI,
        ...ownProps
      },
    }) => ({
      // hack because resetUI throws an error
      onClosed: () => updateUI({
        title: '',
        description: '',
        ownerId: ownProps.ownerId,
        startDate: new Date(),
        endDate: null,
        priority: GoalPriorities.MINOR,
        color: '',
      }),
      onSubmit: e => dispatch(callAsync(() => mutate({
        variables: {
          input: {
            organizationId,
            title,
            description,
            ownerId,
            startDate,
            endDate,
            priority,
            color: color.toUpperCase(),
          },
        },
        update: (proxy, { data: { createGoal: { goal } } }) => {
          const data = addGoal(goal, proxy.readQuery({
            query: Query.DASHBOARD_GOALS,
            variables: { organizationId },
          }));

          return proxy.writeQuery({
            data,
            query: Query.DASHBOARD_GOALS,
            variables: { organizationId },
          });
        },
      }).then(() => isOpen && toggle(e)))),
    }),
  }),
)(GoalAddModal);
