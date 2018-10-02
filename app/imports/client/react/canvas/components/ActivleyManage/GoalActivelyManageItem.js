import React from 'react';
import PropTypes from 'prop-types';
import { compose, append, map, prop } from 'ramda';

import { EntityManagerItem, CardBlock } from '../../../components';
import { GoalForm, GoalAddContainer } from '../../../goals';
import ActivelyManageItem from './ActivelyManageItem';

const addGoal = (goalId, goals) => compose(
  append(goalId),
  map(prop('_id')),
)(goals);

const GoalActivelyManageItem = ({
  entityId,
  organizationId,
  goals,
  onUpdate,
}) => (
  <EntityManagerItem
    {...{ organizationId }}
    itemId="keyGoal"
    label="Key goal"
    component={props => (
      <GoalAddContainer
        component={ActivelyManageItem}
        onAfterSubmit={goalId => onUpdate({
          variables: {
            input: {
              _id: entityId,
              goalIds: addGoal(goalId, goals),
            },
          },
        })}
        {...props}
      />
    )}
  >
    <CardBlock>
      <GoalForm {...{ organizationId }} />
    </CardBlock>
  </EntityManagerItem>
);

GoalActivelyManageItem.propTypes = {
  entityId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  goals: PropTypes.array.isRequired,
};

export default GoalActivelyManageItem;
