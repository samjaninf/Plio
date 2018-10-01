import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'reactstrap';
import { is } from 'ramda';
import { FORM_ERROR } from 'final-form';

import { renderComponent } from '../../helpers';
import { Consumer } from './EntityManagerCards';
import EntityForm from './EntityForm';

const EntityManagerForm = ({
  onSubmit,
  component,
  children,
  render,
  ...props
}) => (
  <Consumer>
    {({ fields, field: { index } }) => (
      <EntityForm
        onSubmit={async (values, form) => {
          try {
            const result = await onSubmit(values, form);

            if (is(Object, result) && Object.prototype.hasOwnProperty.call(result, FORM_ERROR)) {
              return result;
            }

            fields.remove(index);

            return result;
          } catch (err) {
            throw err;
          }
        }}
        {...props}
      >
        {({ handleSubmit, ...rest }) => (
          <Form onSubmit={handleSubmit}>
            {renderComponent({
              component,
              render,
              children,
              ...rest,
            })}
          </Form>
        )}
      </EntityForm>
    )}
  </Consumer>
);

EntityManagerForm.propTypes = {
  component: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  render: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

export default EntityManagerForm;
