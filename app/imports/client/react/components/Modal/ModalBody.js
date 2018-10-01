import PropTypes from 'prop-types';
import React from 'react';
import { ModalBody as ReactstrapModalBody } from 'reactstrap';
import styled from 'styled-components';

const StyledReactstrapModalBody = styled(ReactstrapModalBody)`
  padding: 0;
  & > .preloader {
    padding-top: 10%;
  }
`;

const ModalBody = ({ children, ...props }) => (
  <StyledReactstrapModalBody {...props}>
    {children}
  </StyledReactstrapModalBody>
);

ModalBody.propTypes = {
  children: PropTypes.node,
};

export default ModalBody;
