import PropTypes from 'prop-types';
import React from 'react';

import {
  SwitchViewField,
  CardBlock,
  FormField,
  SelectInputField,
} from '../../components';
import StandardsSelectInputContainer from '../containers/StandardsSelectInputContainer';
// import StandardForm from './GoalFoStandardForm';

const NewStandardCard = ({
  organizationId,
  standards = [],
}) => (
  <SwitchViewField
    name="active"
    buttons={[
      <span key="new">New</span>,
      <span key="existing">Existing</span>,
    ]}
  >
    <CardBlock>
      {/* <StandardForm {...{ organizationId }} /> */}
    </CardBlock>
    <CardBlock>
      <FormField>
        Existing standard
        <StandardsSelectInputContainer
          name="standard"
          component={SelectInputField}
          placeholder="Existing standard"
          {...{ organizationId, standards }}
        />
      </FormField>
    </CardBlock>
  </SwitchViewField>
);

NewStandardCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standards: PropTypes.arrayOf(PropTypes.object),
};

export default NewStandardCard;
