import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions, lenses } from 'plio-util';
import { compose, append, map, prop, view } from 'ramda';
import { pure } from 'recompose';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { ProblemMagnitudes } from '../../../../share/constants';
import { validateRisk } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';

const addRisk = (riskId, risks) => compose(
  append(riskId),
  map(prop('_id')),
)(risks);

const RiskAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onUpdate,
  entityId,
  risks,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Query
        query={Queries.RISK_TYPE_LIST}
        variables={{ organizationId }}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation mutation={Mutations.CREATE_RISK} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([
      { data: { user } },
      {
        data: {
          riskTypes: { riskTypes = [] } = {},
        },
      },
      createRisk,
    ]) => renderComponent({
      ...props,
      isOpen,
      toggle,
      risks,
      organizationId,
      initialValues: {
        active: 0,
        title: '',
        magnitude: ProblemMagnitudes.MAJOR,
        originator: getUserOptions(user),
        owner: getUserOptions(user),
        type: view(lenses.head._id, riskTypes),
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          description,
          originator: { value: originatorId },
          owner: { value: ownerId },
          magnitude,
          type: typeId,
        } = values;

        const linkToEntity = riskId => onUpdate({
          variables: {
            input: {
              _id: entityId,
              riskIds: addRisk(riskId, risks),
            },
          },
        }).then(toggle || noop);

        if (active === 1) {
          return linkToEntity(values.risk.value);
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
        }).then(({ data: { createRisk: { risk } } }) => linkToEntity(risk._id));
      },
    })}
  </Composer>
);

RiskAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  risks: PropTypes.array.isRequired,
  entityId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default pure(RiskAddContainer);
