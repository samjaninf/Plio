import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';

import CanvasForm from './CanvasForm';
import { FormField, PercentInputField } from '../../components';

const CostLineForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      % of total cost
      <PercentInputField
        name="percentOfTotalCost"
        onBlur={save}
      />
    </FormField>
  </CanvasForm>
);

CostLineForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(CostLineForm);
