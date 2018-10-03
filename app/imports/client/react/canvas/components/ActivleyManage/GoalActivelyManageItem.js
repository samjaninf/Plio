import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem, CardBlock } from '../../../components';
import { GoalForm, GoalAddContainer } from '../../../goals';
import ActivelyManageItem from './ActivelyManageItem';

const GoalActivelyManageItem = ({ organizationId, ...restProps }) => (
  <EntityManagerItem
    {...{ organizationId }}
    itemId="keyGoal"
    label="Key goal"
    component={itemProps => (
      <GoalAddContainer
        component={ActivelyManageItem}
        {...{ ...restProps, ...itemProps }}
      />
    )}
  >
    <CardBlock>
      <GoalForm {...{ organizationId }} />
    </CardBlock>
  </EntityManagerItem>
);

GoalActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default GoalActivelyManageItem;
