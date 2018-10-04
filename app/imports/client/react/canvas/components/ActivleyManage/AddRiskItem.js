import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { NewRiskCard, EntityRiskFormContainer } from '../../../risks/components';
import ActivelyManageItem from './ActivelyManageItem';

const AddRiskItem = ({
  organizationId,
  linkedTo,
  onUpdate,
  risks,
}) => (
  <EntityManagerItem
    {...{ organizationId, onUpdate, risks }}
    itemId="risk"
    label="Risk"
    entityId={linkedTo._id}
    component={itemProps => (
      <EntityRiskFormContainer
        component={ActivelyManageItem}
        {...itemProps}
      />
    )}
  >
    <NewRiskCard {...{ organizationId, linkedTo, risks }} />
  </EntityManagerItem>
);

AddRiskItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  risks: PropTypes.array,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddRiskItem;
