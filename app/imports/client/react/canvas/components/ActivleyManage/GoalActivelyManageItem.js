import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { NewGoalCard, GoalAddContainer } from '../../../goals';
import ActivelyManageItem from './ActivelyManageItem';

const GoalActivelyManageItem = ({ organizationId, goals, ...restProps }) => (
  <EntityManagerItem
    {...{ organizationId }}
    itemId="keyGoal"
    label="Key goal"
    component={itemProps => (
      <GoalAddContainer
        component={ActivelyManageItem}
        {...{ goals, ...restProps, ...itemProps }}
      />
    )}
  >
    <NewGoalCard {...{ organizationId, goals }} />
  </EntityManagerItem>
);

GoalActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  goals: PropTypes.array.isRequired,
};

export default GoalActivelyManageItem;
