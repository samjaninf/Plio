import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { validateGoal } from '../../../validation';
import { EntitySubcard } from '../../components';
import GoalEdit from './GoalEdit';

const GoalSubcard = ({
  goal,
  isOpen,
  toggle,
  onDelete,
  error,
  loading,
  initialValues,
  onSubmit,
  ...props
}) => (
  <Form
    {...{ initialValues, onSubmit }}
    validate={validateGoal}
    render={({ handleSubmit }) => (
      <EntitySubcard
        entity={goal}
        header={() => (
          <Fragment>
            <strong>{goal.sequentialId}</strong>
            {' '}
            {goal.title}
          </Fragment>
        )}
        {...{
          isOpen,
          toggle,
          loading,
          error,
          onDelete,
        }}
      >
        <GoalEdit
          {...{ ...goal, ...props }}
          save={handleSubmit}
          isSubcard
        />
      </EntitySubcard>
    )}
  />
);

GoalSubcard.propTypes = {
  goal: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default GoalSubcard;
