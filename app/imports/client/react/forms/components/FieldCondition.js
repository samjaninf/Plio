import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';

const FieldCondition = ({
  when,
  is,
  otherwise = null,
  children,
  ...props
}) => (
  <Field name={when} subscription={{ value: true }} {...props}>
    {({ input }) => {
      const pred = typeof is === 'function' ? is(input.value) : is === input.value;
      if (pred) {
        if (typeof children === 'function') return children({ input });
        return children;
      }

      return otherwise;
    }}
  </Field>
);

FieldCondition.propTypes = {
  when: PropTypes.string.isRequired,
  is: PropTypes.any,
  otherwise: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default FieldCondition;
