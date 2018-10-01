import PropTypes from 'prop-types';
import React from 'react';
import { FormText } from 'reactstrap';

import FormControlStatic from '../forms/components/FormControlStatic';

const EntityLabel = ({
  title,
  sequentialId,
  children,
  ...props
}) => (
  <FormControlStatic {...props}>
    <FormText tag="span">{sequentialId}</FormText>
    {' '}
    {title}
    {children}
  </FormControlStatic>
);

EntityLabel.propTypes = {
  title: PropTypes.node,
  sequentialId: PropTypes.node,
  children: PropTypes.node,
};

export default EntityLabel;
