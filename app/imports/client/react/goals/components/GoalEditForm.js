import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import {
  Status,
  FormField,
  TextareaField,
} from '../../components';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses } from '../../../../share/constants';
import GoalForm from './GoalForm';

export const GoalEditFrom = ({
  status,
  organizationId,
  sequentialId,
  save,
}) => (
  <Fragment>
    <GoalForm {...{ organizationId, sequentialId, save }} />
    <FormField>
      Status
      <Status color={getStatusColor(status)}>
        {GoalStatuses[status]}
      </Status>
    </FormField>
    <FormField>
      Status comment
      <TextareaField
        name="statusComment"
        placeholder="Status comment"
        onBlur={save}
      />
    </FormField>
  </Fragment>
);

GoalEditFrom.propTypes = {
  status: PropTypes.number.isRequired,
  organizationId: PropTypes.string,
  sequentialId: PropTypes.string,
  save: PropTypes.func.isRequired,
};

export default pure(GoalEditFrom);
