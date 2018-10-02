import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Form } from 'reactstrap';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  CardBlock,
} from '../../components';
import GoalForm from './GoalForm';

export const GoalAddModal = ({
  isOpen,
  toggle,
  onSubmit,
  organizationId,
  initialValues,
}) => (
  <EntityModalNext {...{ isOpen, toggle }}>
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      keepDirtyOnReinitialize
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Key goal" />
          <EntityModalBody>
            <CardBlock>
              <Form onSubmit={handleSubmit}>
                {/* hidden input is needed for return key to work */}
                <input hidden type="submit" />
                <GoalForm {...{ organizationId }} />
              </Form>
            </CardBlock>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);

GoalAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

export default GoalAddModal;
