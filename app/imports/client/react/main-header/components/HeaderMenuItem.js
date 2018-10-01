import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DropdownItem } from 'reactstrap';

import { Styles } from '../../../../api/constants';
import { Icon } from '../../components';

const DropdownItemStyled = styled(DropdownItem)`
  &.dropdown-item {
    padding: 10px 15px;
    & > .fa {
      float: right;
      font-size: 12px;
      position: relative;
      top: 5px;
      color: ${Styles.color.blue}
    }
    &:focus {
      outline:0;
    }
  }
`;

const HeaderMenuItem = ({ children, active, ...props }) => (
  <DropdownItemStyled {...props}>
    <span>{children}</span>
    {active ? <Icon name="check" /> : null}
  </DropdownItemStyled>
);

HeaderMenuItem.defaultProps = {
  active: false,
};

HeaderMenuItem.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default HeaderMenuItem;
