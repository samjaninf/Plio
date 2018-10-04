import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { NewRiskCard, EntityRiskFormContainer } from '../../../risks/components';
import ActivelyManageItem from './ActivelyManageItem';

const AddRiskItem = ({
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
    component={EntityRiskFormContainer}
    render={ActivelyManageItem}
  >
    <NewRiskCard {...{ organizationId, linkedTo, risks }} />
  </EntityManagerItem>
);

AddRiskItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  risks: PropTypes.array,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddRiskItem;
