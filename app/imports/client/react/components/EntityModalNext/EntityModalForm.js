import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { withHandlers } from 'recompose';
import { FORM_ERROR } from 'final-form';

import { handleGQError } from '../../../../api/handleGQError';

const enhance = withHandlers({
  onSubmit: ({ onSubmit }) => async (...args) => {
    try {
      return await onSubmit(...args);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(err);
      }

      return { [FORM_ERROR]: handleGQError(err) };
    }
  },
});

const EntityModalForm = props => <Form {...props} />;

EntityModalForm.defaultProps = {
  subscription: {},
};

EntityModalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  subscription: PropTypes.object,
};

export default enhance(EntityModalForm);
