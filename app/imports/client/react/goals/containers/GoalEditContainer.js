import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
  find,
  where,
  contains,
  defaultTo,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import {
  getUserOptions,
  lenses,
  noop,
  toDate,
  getValue,
  getValues,
  mapUsersToOptions,
} from 'plio-util';
import moment from 'moment';
import diff from 'deep-diff';

import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { onDelete } from '../handlers';
import { ApolloFetchPolicies } from '../../../../api/constants';

const getGoal = pathOr({}, repeat('goal', 2));
const getInitialValues = compose(
  over(lenses.startDate, moment),
  over(lenses.endDate, moment),
  over(lenses.completedAt, unless(isNil, moment)),
  over(lenses.owner, getUserOptions),
  over(lenses.completedBy, getUserOptions),
  over(lenses.notify, compose(mapUsersToOptions, defaultTo([]))),
  pick([
    'title',
    'description',
    'startDate',
    'endDate',
    'priority',
    'color',
    'statusComment',
    'completionComment',
    'completedAt',
    'owner',
    'completedBy',
    'isCompleted',
    'notify',
  ]),
  getGoal,
);
const getRefetchQueries = () => [
  Queries.DASHBOARD_GOALS.name,
  Queries.COMPLETED_DELETED_GOALS.name,
  Queries.GOAL_LIST.name,
];

const GoalEditContainer = ({
  goalId,
  organizationId,
  isOpen,
  toggle,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  canEditGoals,
  ...props
}) => (
  <WithState initialState={{ goal: null, initialValues: {} }}>
    {({ state: { initialValues, goal }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.GOAL_CARD}
            variables={{ _id: goalId }}
            onCompleted={data => setState({
              initialValues: getInitialValues(data),
              goal: getGoal(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_GOAL}
            children={noop}
            onCompleted={({ updateGoal }) => setState({ goal: updateGoal })}
          />,
          <Mutation
            mutation={Mutations.DELETE_GOAL}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.COMPLETE_GOAL}
            refetchQueries={getRefetchQueries}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UNDO_GOAL_COMPLETION}
            refetchQueries={getRefetchQueries}
            children={noop}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { data, loading, error },
          updateGoal,
          deleteGoal,
          completeGoal,
          undoGoalCompletion,
        ]) => renderComponent({
          ...props,
          loading,
          error,
          organizationId,
          isOpen,
          toggle,
          initialValues,
          goal,
          canEditGoals,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(data);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              description = '',
              owner: { value: ownerId } = {},
              startDate,
              endDate,
              priority,
              color,
              statusComment = '',
              completionComment = '',
              completedAt,
              completedBy,
              isCompleted,
              fileIds,
              notify,
            } = values;

            const isCompletedDiff = find(where({ path: contains('isCompleted') }), difference);

            if (isCompletedDiff) {
              if (isCompleted) {
                return completeGoal({
                  variables: {
                    input: {
                      _id: goal._id,
                      completionComment,
                    },
                  },
                }).then(noop).catch((err) => {
                  form.reset(currentValues);
                  throw err;
                });
              }

              return undoGoalCompletion({
                variables: {
                  input: { _id: goal._id },
                },
              }).then(noop).catch((err) => {
                form.reset(currentValues);
                throw err;
              });
            }

            const args = {
              variables: {
                input: {
                  _id: goal._id,
                  title,
                  description,
                  ownerId,
                  startDate: toDate(startDate),
                  endDate: toDate(endDate),
                  priority,
                  color,
                  statusComment,
                  completionComment,
                  completedAt: unless(isNil, toDate, completedAt),
                  completedBy: getValue(completedBy),
                  fileIds,
                },
              },
            };

            if (notify) {
              Object.assign(args, { notify: getValues(notify) });
            }

            return updateGoal(args).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: canEditGoals ? () => onDelete({
            mutate: deleteGoal,
            ownProps: { organizationId, goal },
          }).then(toggle) : undefined,
        })}
      </Composer>
    )}
  </WithState>
);

GoalEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  goalId: PropTypes.string.isRequired,
  fetchPolicy: PropTypes.string,
  canEditGoals: PropTypes.bool,
};

export default pure(GoalEditContainer);
