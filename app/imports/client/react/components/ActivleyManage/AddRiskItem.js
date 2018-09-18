import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { append, map, prop, compose, view } from 'ramda';
import { noop, getUserOptions, lenses } from 'plio-util';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateRisk } from '../../../validation';
import { ProblemMagnitudes } from '../../../../share/constants';
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

const AddRiskItem = ({ organizationId, linkedTo, risks = [] }) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.RISK_CARD}
        variables={{ organizationId }}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation mutation={Mutations.UPDATE_KEY_PARTNER} children={noop} />,
      <Mutation mutation={Mutations.CREATE_RISK} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([
      {
        data: {
          user,
          riskTypes: { riskTypes = [] } = {},
        },
      },
      updateKeyPartner,
      createRisk,
    ]) => (
      <EntityManagerItem
        component={ActivelyManageItem}
        itemId="risk"
        label="Risk"
        initialValues={{
          active: 0,
          title: null,
          magnitude: ProblemMagnitudes.MAJOR,
          originator: getUserOptions(user),
          owner: getUserOptions(user),
          type: view(lenses.head._id, riskTypes),
        }}
        onSubmit={(values, callback) => {
          const {
            active,
            title,
            description,
            originator: { value: originatorId },
            owner: { value: ownerId },
            magnitude,
            type: typeId,
          } = values;

          const linkRisk = riskId => updateKeyPartner({
            variables: {
              input: {
                _id: linkedTo._id,
                riskIds: addRisk(riskId, risks),
              },
            },
          }).then(callback);

          if (active === 1) {
            return linkRisk(values.risk.value);
          }

          const errors = validateRisk(values);
          if (errors) return errors;

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
          }).then(({ data: { createRisk: { risk } } }) => linkRisk(risk._id));
        }}
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
