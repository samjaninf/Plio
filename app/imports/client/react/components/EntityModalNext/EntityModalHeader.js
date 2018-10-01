import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle } from 'reactstrap';

import { ModalHeader } from '../Modal';
import EntityModalLeftHeaderButton from './EntityModalLeftHeaderButton';
import EntityModalRightHeaderButton from './EntityModalRightHeaderButton';

const EntityModalHeader = ({ label, children, ...props }) => (
  <ModalHeader
    renderLeftButton={<EntityModalLeftHeaderButton />}
    renderRightButton={<EntityModalRightHeaderButton />}
    {...props}
  >
    {children || label && (<CardTitle>{label}</CardTitle>)}
  </ModalHeader>
);

EntityModalHeader.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

export default EntityModalHeader;
