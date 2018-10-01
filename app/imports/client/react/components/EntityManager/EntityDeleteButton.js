import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';
import { Button } from 'reactstrap';

const EntityDeleteButton = ({ children, ...props }) => (
  <FormSpy subscription={{ submitting: true }}>
    {({ submitting }) => (
      <Button
        color="secondary"
        disabled={submitting}
        {...props}
      >
        {children}
      </Button>
    )}
  </FormSpy>
);

EntityDeleteButton.defaultProps = {
  children: 'Delete',
};

EntityDeleteButton.propTypes = {
  children: PropTypes.node,
};

export default EntityDeleteButton;
