import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import GuidanceIcon from '../GuidanceIcon';
import { Consumer } from './EntityModal';

const EntityModalLeftHeaderButton = ({ label, ...props }) => (
  <Consumer>
    {({
      state: { isGuidanceOpen },
      toggleGuidance,
      isEditMode,
      toggle,
      noForm,
    }) => isEditMode || noForm ? (
      <GuidanceIcon isOpen={isGuidanceOpen} onClick={toggleGuidance} {...props} />
    ) : (
      <Button onClick={toggle} {...props}>{label}</Button>
    )}
  </Consumer>
);

EntityModalLeftHeaderButton.defaultProps = {
  label: 'Close',
};

EntityModalLeftHeaderButton.propTypes = {
  label: PropTypes.string,
};

export default EntityModalLeftHeaderButton;
