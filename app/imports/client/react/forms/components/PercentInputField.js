import React from 'react';
import { Field } from 'react-final-form';
import { InputGroup } from 'reactstrap';
import styled from 'styled-components';

import { InputGroupAddon } from '../../components';
import InputAdapter from './InputAdapter';

const StyledInputGroup = styled(InputGroup)`
  max-width: 95px;
`;

const PercentInputField = props => (
  <StyledInputGroup>
    <Field
      {...props}
      type="number"
      min={0}
      max={100}
      component={InputAdapter}
    />
    <InputGroupAddon addonType="append">%</InputGroupAddon>
  </StyledInputGroup>
);

export default PercentInputField;
