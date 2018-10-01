import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  Button,
  Tooltip,
  ButtonGroup,
} from 'reactstrap';

import { WithToggle } from '../../helpers';

const StyledDropdownMenu = styled(DropdownMenu)`
  transform: none !important;
  top: auto !important;
  left: auto !important;
`;

const CanvasLabel = ({
  children,
  label,
  tooltip,
  ...props
}) => {
  const id = `Tooltip-${label}`;

  return (
    <WithToggle>
      {({ isOpen, toggle }) => children ? (
        <ButtonDropdown
          direction="up"
          group={false}
          color="secondary"
          size="sm"
          {...{ ...props, isOpen, toggle }}
        >
          <DropdownToggle>
            {label}
          </DropdownToggle>
          <StyledDropdownMenu>
            {children}
          </StyledDropdownMenu>
        </ButtonDropdown>
      ) : (
        <ButtonGroup {...props}>
          <Button color="secondary" size="sm" {...{ id }}>
            {label}
          </Button>
          {tooltip && (
            <Tooltip placement="top" target={id} {...{ isOpen, toggle }}>
              {tooltip}
            </Tooltip>
          )}
        </ButtonGroup>
      )}
    </WithToggle>
  );
};

CanvasLabel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltip: PropTypes.string,
};

const StyledCanvasLabel = styled(CanvasLabel)`
  margin: 0 5px 4px 0;
  display: inline-block;

  & > button {
    padding: 0.1rem 0.7rem 0.15rem !important;
  }
`;

export default StyledCanvasLabel;
