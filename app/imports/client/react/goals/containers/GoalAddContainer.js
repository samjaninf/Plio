import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';
import { compose, append, map, prop } from 'ramda';

import { GoalColors, GoalPriorities } from '../../../../share/constants';
import { moveGoalWithinCacheAfterCreating } from '../../../apollo/utils';
import { validateGoal } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const addGoal = (goalId, goals) => compose(
  append(goalId),
  map(prop('_id')),
)(goals);

const GoalAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onUpdate,
  entityId,
  goals,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_GOAL}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createGoal]) => renderComponent({
      ...props,
      organizationId,
      goals,
      isOpen,
      toggle,
      initialValues: {
        active: 0,
        title: '',
        description: '',
        owner: getUserOptions(user),
        startDate: new Date(),
        endDate: null,
        priority: GoalPriorities.MINOR,
        color: GoalColors.INDIGO,
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          description = '',
          owner: { value: ownerId } = {},
          startDate,
          endDate,
          priority,
          color,
        } = values;
        let linkToEntity;

        if (entityId) {
          linkToEntity = goalId => onUpdate({
            variables: {
              input: {
                _id: entityId,
                goalIds: addGoal(goalId, goals),
              },
            },
          });

          if (active === 1) {
            return linkToEntity(values.goal.value).then(() => toggle && toggle());
          }
        }

        const errors = validateGoal(values);
        if (errors) return errors;

        return createGoal({
          variables: {
            input: {
              title,
              description,
              startDate,
              endDate,
              priority,
              color,
              organizationId,
              ownerId,
            },
          },
          update: (proxy, { data: { createGoal: { goal } } }) =>
            moveGoalWithinCacheAfterCreating(organizationId, goal, proxy),
        }).then(({ data: { createGoal: { goal } } }) => {
          if (linkToEntity) linkToEntity(goal._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

GoalAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onUpdate: PropTypes.func,
  goals: PropTypes.array,
  entityId: PropTypes.string,
};

export default pure(GoalAddContainer);
