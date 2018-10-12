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
import MilestoneForm from './MilestoneForm';
import MilestoneEdit from './MilestoneEdit';
import { validateMilestone } from '../../../validation';

export const MilestoneEditModal = ({
  isOpen,
  toggle,
  organizationId,
  onDelete,
  loading,
  error,
  initialValues,
  onSubmit,
  milestone,
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
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      validate={validateMilestone}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Milestone" />
          <EntityModalBody>
            <RenderSwitch
              {...{ loading }}
              renderLoading={<MilestoneForm {...{ organizationId }} />}
              errorWhenMissing={noop}
              require={milestone}
            >
              {({ _id }) => (
                <MilestoneEdit
                  {...{ _id, organizationId }}
                  save={handleSubmit}
                />
              )}
            </RenderSwitch>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);

MilestoneEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  milestone: PropTypes.object,
};

export default pure(MilestoneEditModal);
