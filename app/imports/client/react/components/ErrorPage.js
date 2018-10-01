import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

const ErrorPage = ({ error }) => (
  <Col className="not-found text-xs-center">
    <h1>{error}</h1>
  </Col>
);

ErrorPage.propTypes = {
  error: PropTypes.string,
};

export default ErrorPage;
