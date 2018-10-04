import PropTypes from 'prop-types';
import React from 'react';

import {
  SwitchViewField,
  CardBlock,
  FormField,
  SelectInputField,
} from '../../components';
import GoalSelectInputContainer from '../containers/GoalSelectInputContainer';
import GoalForm from './GoalForm';

const NewGoalCard = ({
  organizationId,
  goals = [],
}) => (
  <SwitchViewField
    name="active"
    buttons={[
      <span key="new">New</span>,
      <span key="existing">Existing</span>,
    ]}
  >
    <CardBlock>
      <GoalForm {...{ organizationId }} />
    </CardBlock>
    <CardBlock>
      <FormField>
        Existing goal
        <GoalSelectInputContainer
          name="goal"
          component={SelectInputField}
          placeholder="Existing goal"
          {...{ organizationId, goals }}
        />
      </FormField>
    </CardBlock>
  </SwitchViewField>
);

NewGoalCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  goals: PropTypes.arrayOf(PropTypes.object),
};

export default NewGoalCard;
