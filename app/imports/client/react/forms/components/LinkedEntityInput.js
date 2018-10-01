import PropTypes from 'prop-types';
import React from 'react';
import { InputGroup, Input } from 'reactstrap';
import { pure } from 'recompose';
import styled from 'styled-components';

import { InputGroupAddon } from '../../components';

const StyledInputGroup = styled(InputGroup)`
  & > .clearable-field-container {
    min-height: 34px;
  }
`;

const LinkedEntityInput = ({ sequentialId, component: Component = Input, ...props }) => {
  const input = <Component {...props} />;

  if (!sequentialId) return input;

  return (
    <StyledInputGroup>
      <InputGroupAddon addonType="prepend">
        {sequentialId}
      </InputGroupAddon>
      {input}
    </StyledInputGroup>
  );
};

LinkedEntityInput.propTypes = {
  sequentialId: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default pure(LinkedEntityInput);
