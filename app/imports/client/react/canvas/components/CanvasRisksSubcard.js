import React from 'react';
import PropTypes from 'prop-types';

import { RisksSubcard, EntityRiskFormContainer } from '../../risks';

const CanvasRisksSubcard = ({
  organizationId,
  risks,
  linkedTo,
  onUpdate,
}) => (
  <EntityRiskFormContainer
    {...{
      organizationId,
      risks,
      onUpdate,
      linkedTo,
    }}
    entityId={linkedTo._id}
    onDelete={console.log}
    render={({ onSubmit, ...restRiskProps }) => (
      <RisksSubcard {...restRiskProps} onSave={onSubmit} />
    )}
  />
);

CanvasRisksSubcard.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  risks: PropTypes.array.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default CanvasRisksSubcard;
