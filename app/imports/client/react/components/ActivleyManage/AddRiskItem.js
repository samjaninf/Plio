import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { Mutation as Mutations } from '../../../graphql';
import { validateRisk } from '../../../validation';
import {
  EntityManagerItem,
  ActivelyManageItem,
} from '../../components';


const AddRiskItem = ({ organizationId, ...restProps }) => (
  <Mutation mutation={Mutations.CREATE_RISK}>
    {createRisk => (
      <EntityManagerItem
        component={ActivelyManageItem}
        itemId="risk"
        label="Risk"
        onSubmit={(values) => {
          const errors = validateRisk(values);
          if (errors) return errors;

          const {
            title,
            description,
            originator: { value: originatorId },
            owner: { value: ownerId },
            magnitude,
            type: typeId,
          } = values;

          return createRisk({
            variables: {
              input: {
                title,
                description,
                originatorId,
                ownerId,
                magnitude,
                typeId,
                organizationId,
                // entityId: entity._id,
              },
            },
          });
        }}
        {...restProps}
      />
    )}
  </Mutation>
);

AddRiskItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default AddRiskItem;
