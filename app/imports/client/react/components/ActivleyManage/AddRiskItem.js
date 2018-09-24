import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { Mutation as Mutations } from '../../../graphql';
import {
  EntityManagerItem,
  ActivelyManageItem,
} from '../../components';
import { NewRiskCard, EntityRiskFormContainer } from '../../risks/components';

const AddRiskItem = ({ organizationId, linkedTo, risks = [] }) => (
  <Mutation mutation={Mutations.UPDATE_KEY_PARTNER}>
    {updateKeyPartner => (
      <EntityRiskFormContainer
        {...{ organizationId, risks }}
        onUpdate={updateKeyPartner}
        entityId={linkedTo._id}
      >
        {props => (
          <EntityManagerItem
            component={ActivelyManageItem}
            itemId="risk"
            label="Risk"
            {...props}
          >
            <NewRiskCard {...{ organizationId, linkedTo, risks }} />
          </EntityManagerItem>
        )}
      </EntityRiskFormContainer>
    )}
  </Mutation>
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
