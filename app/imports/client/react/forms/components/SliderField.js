import React from 'react';
import { Field } from 'react-final-form';

import SliderAdapter from './SliderAdapter';

const SliderField = props => (
  <Field
    component={SliderAdapter}
    {...props}
  />
);

export default SliderField;
