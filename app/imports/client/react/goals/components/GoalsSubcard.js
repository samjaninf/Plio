import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerSubcard } from '../../components';
import GoalEditContainer from '../containers/GoalEditContainer';
import NewGoalCard from './NewGoalCard';
import GoalSubcard from './GoalSubcard';

const GoalsSubcard = ({
  organizationId,
  goals,
  onSubmit,
  ...props
}) => (
  <EntityManagerSubcard
    {...props}
    title="Key goals"
    newEntityTitle="New key goal"
    newEntityButtonTitle="Add a new key goal"
    entities={goals}
    onSave={onSubmit}
    render={({ entity, isOpen, toggle }) => (
      <GoalEditContainer
        {...{
          organizationId,
          isOpen,
          toggle,
        }}
        key={entity._id}
        goalDoc={entity}
        component={GoalSubcard}
      />
    )}
    renderNewEntity={() => <NewGoalCard {...{ organizationId, goals }} />}
  />
);

GoalsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  goals: PropTypes.array.isRequired,
};

export default GoalsSubcard;
