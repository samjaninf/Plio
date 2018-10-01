import React from 'react';
import styled from 'styled-components';
import Blaze from 'meteor/gadicc:blaze-react-component';
import PropTypes from 'prop-types';
import { Navbar } from 'reactstrap';

import { Styles } from '../../../../api/constants';
import OrganizationMenu from './OrganizationMenu';

const NavbarStyled = styled(Navbar)`
  .navbar-nav {
    margin: 0;
    padding: 0;
    height: 50px;
    .dropdown {
      height: 50px;
    }
    .dropdown-toggle {
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      font-size: 16px;
      &:after {
        font-size: 18px;
      }
      &:hover {
        &:after, .secondary-label {
          color: ${Styles.color.hoverLightBlue};
        }
      }
    }
  }
  .secondary-label, .dropdown-toggle:after {
    transition: color 0.4s ease;
    color: ${Styles.color.lightBlue};
  }
`;

const MainHeader = ({ organization, isDashboard }) => (
  <NavbarStyled dark>
    <OrganizationMenu {...{ organization, isDashboard }} />
    <Blaze
      template="UserMenu"
      // Blaze component renders <span> tag and messes up styling
      className="nav navbar-nav pull-xs-right"
      organizationId={organization._id}
      organizationName={organization.name}
    />
  </NavbarStyled>
);

MainHeader.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isDashboard: PropTypes.bool,
};

export default MainHeader;
