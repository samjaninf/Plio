import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { append, map, prop, compose } from 'ramda';
import { noop } from 'plio-util';

import { Mutation as Mutations } from '../../../graphql';
import { validateRisk } from '../../../validation';
import { Composer } from '../../helpers';
import {
  EntityManagerItem,
  ActivelyManageItem,
} from '../../components';
import NewRiskCard from '../../risks/components/NewRiskCard';

const addRisk = (riskId, risks) => compose(
  append(riskId),
  map(prop('_id')),
)(risks);

const AddRiskItem = ({
  organizationId,
  linkedTo,
  risks = [],
  ...restProps
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.UPDATE_KEY_PARTNER} children={noop} />,
      <Mutation mutation={Mutations.CREATE_RISK} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([updateKeyPartner, createRisk]) => (
      <EntityManagerItem
        component={ActivelyManageItem}
        itemId="risk"
        label="Risk"
        onSubmit={(values, callback) => {
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
              },
            },
          }).then(({ data: { createRisk: { risk } } }) => updateKeyPartner({
            variables: {
              input: {
                _id: linkedTo._id,
                riskIds: addRisk(risk._id, risks),
              },
            },
          })).then(callback);
        }}
        {...restProps}
      >
        <NewRiskCard {...{ organizationId, linkedTo, risks }} />
      </EntityManagerItem>
    )}
  </Composer>
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
