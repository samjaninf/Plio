import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { noop } from 'plio-util';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';
import GoalForm from './GoalForm';
import GoalEdit from './GoalEdit';
import { GoalsHelp } from '../../../../api/help-messages';
import { validateGoal } from '../../../validation';

export const GoalEditModal = ({
  isOpen,
  toggle,
  organizationId,
  onDelete,
  loading,
  error,
  initialValues,
  onSubmit,
  goal,
  canEditGoals,
}) => (
  <EntityModalNext
    {...{
      isOpen,
      toggle,
      loading,
      error,
      onDelete,
    }}
    isEditMode
    guidance={GoalsHelp.goal}
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      validate={validateGoal}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Key Goal" />
          <EntityModalBody>
            <RenderSwitch
              {...{ loading }}
              renderLoading={<GoalForm {...{ organizationId }} />}
              errorWhenMissing={noop}
              require={goal}
            >
              <GoalEdit
                {...{ ...goal, organizationId, canEditGoals }}
                save={handleSubmit}
              />
            </RenderSwitch>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);


GoalEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  goal: PropTypes.object,
  canEditGoals: PropTypes.bool,
};

export default pure(GoalEditModal);
