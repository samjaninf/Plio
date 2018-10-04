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
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop, toDate, getValue } from 'plio-util';
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
  ]),
);
const getRefetchQueries = () => [
  Queries.DASHBOARD_GOALS.name,
  Queries.COMPLETED_DELETED_GOALS.name,
  Queries.GOAL_LIST.name,
];

const GoalEditContainer = ({
  goalDoc,
  goalId = goalDoc && goalDoc._id,
  organizationId,
  isOpen,
  toggle,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  canEditGoals,
  ...props
}) => (
  <WithState
    initialState={{
      goal: goalDoc || null,
      initialValues: goalDoc ? getInitialValues(goalDoc) : {},
    }}
  >
    {({ state: { initialValues, goal }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.GOAL_CARD}
            variables={{ _id: goalId }}
            skip={!!goalDoc}
            onCompleted={data => setState({
              initialValues: getInitialValues(getGoal(data)),
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
            onCompleted={({ completeGoal }) => setState({
              goal: { ...goal, ...completeGoal },
              initialValues: getInitialValues({ ...goal, ...completeGoal }),
            })}
          />,
          <Mutation
            mutation={Mutations.UNDO_GOAL_COMPLETION}
            refetchQueries={getRefetchQueries}
            children={noop}
            onCompleted={
              ({ undoGoalCompletion }) => setState({
                goal: { ...goal, ...undoGoalCompletion },
                initialValues: getInitialValues({ ...goal, ...undoGoalCompletion }),
              })
            }
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { loading, error },
          updateGoal,
          deleteGoal,
          completeGoal,
          undoGoalCompletion,
        ]) => renderComponent({
          ...props,
          error,
          organizationId,
          isOpen,
          toggle,
          initialValues,
          goal,
          canEditGoals,
          loading: !goalDoc && loading,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(goal);
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

            return updateGoal({
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
            }).then(noop).catch((err) => {
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
  goalId: PropTypes.string,
  goalDoc: PropTypes.object,
  fetchPolicy: PropTypes.string,
  canEditGoals: PropTypes.bool,
};

export default pure(GoalEditContainer);
