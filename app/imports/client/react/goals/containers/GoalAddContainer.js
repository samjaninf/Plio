import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';

import { GoalColors, GoalPriorities } from '../../../../share/constants';
import { moveGoalWithinCacheAfterCreating } from '../../../apollo/utils';
import { validateGoal } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const GoalAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onAfterSubmit,
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
      isOpen,
      toggle,
      initialValues: {
        title: '',
        description: '',
        owner: getUserOptions(user),
        startDate: new Date(),
        endDate: null,
        priority: GoalPriorities.MINOR,
        color: GoalColors.INDIGO,
      },
      onSubmit: (values) => {
        const errors = validateGoal(values);

        if (errors) return errors;

        const {
          title,
          description = '',
          owner: { value: ownerId } = {},
          startDate,
          endDate,
          priority,
          color,
        } = values;

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
          if (onAfterSubmit) onAfterSubmit(goal._id);
          toggle();
        });
      },
    })}
  </Composer>
);

GoalAddContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onAfterSubmit: PropTypes.func,
};

export default GoalAddContainer;
