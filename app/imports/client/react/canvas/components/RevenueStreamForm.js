import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';

import CanvasForm from './CanvasForm';
import { FormField, PercentInputField } from '../../components';

const RevenueStreamForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      % of revenue
      <PercentInputField name="percentOfRevenue" onBlur={save} />
    </FormField>
    <FormField>
      % of profit
      <PercentInputField name="percentOfProfit" onBlur={save} />
    </FormField>
  </CanvasForm>
);

RevenueStreamForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(RevenueStreamForm);
