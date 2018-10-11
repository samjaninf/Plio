import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';
import { eqBy, equals } from 'ramda';
import { getValue } from 'plio-util';

import SelectInputAdapter from './SelectInputAdapter';

const SelectInputField = ({ multi, ...props }) => (
  <Field
    component={SelectInputAdapter}
    isEqual={multi ? equals : eqBy(getValue)}
    {...{ ...props, multi }}
  />
);

SelectInputField.propTypes = {
  multi: PropTypes.bool,
};

export default SelectInputField;
