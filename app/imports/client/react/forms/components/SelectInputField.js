import React from 'react';
import { Field } from 'react-final-form';
import { eqBy } from 'ramda';
import { getValue } from 'plio-util';

import SelectInputAdapter from './SelectInputAdapter';

const isEqual = eqBy(getValue);

const SelectInputField = props => (
  <Field
    component={SelectInputAdapter}
    {...{ ...props, isEqual }}
  />
);

export default SelectInputField;
