import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { NewRiskCard, RiskAddContainer } from '../../../risks';
import ActivelyManageItem from './ActivelyManageItem';

const RiskActivelyManageItem = ({
  organizationId,
  linkedTo,
  risks,
  ...rest
}) => (
  <EntityManagerItem
    {...{ organizationId, risks, ...rest }}
    itemId="risk"
    label="Risk"
    entityId={linkedTo._id}
    component={RiskAddContainer}
    render={ActivelyManageItem}
  >
    <NewRiskCard {...{ organizationId, linkedTo, risks }} />
  </EntityManagerItem>
);

RiskActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  risks: PropTypes.array,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default RiskActivelyManageItem;
