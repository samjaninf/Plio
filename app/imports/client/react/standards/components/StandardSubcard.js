import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { validateStandard } from '../../../validation';
import { EntitySubcard, CardBlock } from '../../components';
import StandardEditForm from './StandardEditForm';

const StandardSubcard = ({
  standard,
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
    validate={validateStandard}
    render={({ handleSubmit }) => (
      <EntitySubcard
        entity={standard}
        header={() => standard.title}
        {...{
          isOpen,
          toggle,
          loading,
          error,
          onDelete,
        }}
      >
        <CardBlock>
          <StandardEditForm {...props} save={handleSubmit} />
        </CardBlock>
      </EntitySubcard>
    )}
  />
);

StandardSubcard.propTypes = {
  standard: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default StandardSubcard;
