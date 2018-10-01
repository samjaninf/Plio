import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { handleGQError } from '../../../../api/handleGQError';

const EntityManagerForm = ({ onSubmit, ...props }) => (
  <Form
    subscription={{}}
    onSubmit={async (values, form) => {
      try {
        return await onSubmit(values, form);
      } catch (err) {
        return { [FORM_ERROR]: handleGQError(err) };
      }
    }}
    {...props}
  />
);

EntityManagerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default EntityManagerForm;
