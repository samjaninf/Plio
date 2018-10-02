import PropTypes from 'prop-types';
import React from 'react';
import { getUserOptions } from 'plio-util';
import { Mutation } from 'react-apollo';
import { pure } from 'recompose';

import { GoalColors, GoalPriorities } from '../../../../share/constants';
import { moveGoalWithinCacheAfterCreating } from '../../../apollo/utils';
import { validateGoal } from '../../../validation';
import GoalAddModal from '../components/GoalAddModal';
import { Mutation as Mutations } from '../../../graphql';

const GoalAddModalContainer = ({
  owner,
  organizationId,
  isOpen,
  toggle,
}) => (
  <Mutation mutation={Mutations.CREATE_GOAL}>
    {createGoal => (
      <GoalAddModal
        {...{ organizationId, isOpen, toggle }}
        initialValues={{
          title: '',
          description: '',
          owner: getUserOptions(owner),
          startDate: new Date(),
          endDate: null,
          priority: GoalPriorities.MINOR,
          color: GoalColors.INDIGO,
        }}
        onSubmit={(values) => {
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
          }).then(toggle);
        }}
      />
    )}
  </Mutation>
);

GoalAddModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  owner: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(GoalAddModalContainer);
