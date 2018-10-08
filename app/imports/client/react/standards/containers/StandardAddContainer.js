import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { compose, append, map, prop, view, find, propEq, either } from 'ramda';
import { noop, getUserOptions, lenses, getId } from 'plio-util';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateStandard } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { StandardStatusTypes, DefaultStandardTypes } from '../../../../share/constants';

const addStandard = (goalId, goals) => compose(
  append(goalId),
  map(prop('_id')),
)(goals);

const getDefaultType = either(
  compose(
    getId,
    find(propEq(
      'title',
      DefaultStandardTypes.STANDARD_OPERATING_PROCEDURE.title,
    )),
  ),
  view(lenses.head._id),
);

const StandardAddContainer = ({
  organizationId,
  isOpen,
  toggle = noop,
  entityId,
  standards,
  onUpdate,
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
        query={Queries.STANDARD_TYPE_LIST}
        variables={{ organizationId }}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_STANDARD}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([
      { data: { user } },
      {
        data: {
          standardTypes: { standardTypes = [] } = {},
        },
      },
      createStandard,
    ]) => renderComponent({
      ...props,
      organizationId,
      standards,
      isOpen,
      toggle,
      initialValues: {
        active: 0,
        title: '',
        // section: 'some section option',
        status: StandardStatusTypes.ISSUED,
        owner: getUserOptions(user),
        // source: null,
        type: getDefaultType(standardTypes),
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          status,
          // section: { value: sectionId } = {},
          owner: { value: ownerId } = {},
          type: typeId,
          // source: source1,
        } = values;
        let linkToEntity;

        if (entityId) {
          linkToEntity = standardId => onUpdate({
            variables: {
              input: {
                _id: entityId,
                standardIds: addStandard(standardId, standards),
              },
            },
          });

          if (active === 1) {
            return linkToEntity(values.standard.value).then(toggle);
          }
        }

        const errors = validateStandard(values);
        if (errors) return errors;

        return createStandard({
          variables: {
            input: {
              title,
              status,
              // sectionId,
              typeId,
              ownerId,
              // source1,
              organizationId,
            },
          },
        }).then(({ data: { createStandard: { standard } } }) => {
          if (linkToEntity) linkToEntity(standard._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

StandardAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onUpdate: PropTypes.func,
  standards: PropTypes.array,
  entityId: PropTypes.string,
};

export default StandardAddContainer;
