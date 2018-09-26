import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';
import { Form } from 'reactstrap';
import { pure } from 'recompose';

import { CanvasColors, CRITICALITY_DEFAULT } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import KeyPartnerForm from './KeyPartnerForm';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateKeyPartner } from '../../../validation';

const KeyPartnerAddModal = ({ isOpen, toggle, organizationId }) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_KEY_PARTNER}>
        {createKeyPartner => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: CanvasColors.INDIGO,
                criticality: CRITICALITY_DEFAULT,
                levelOfSpend: CRITICALITY_DEFAULT,
                notes: '',
              }}
              onSubmit={(values) => {
                const errors = validateKeyPartner(values);

                if (errors) return errors;

                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  criticality,
                  levelOfSpend,
                  notes,
                } = values;

                return createKeyPartner({
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      color,
                      criticality,
                      levelOfSpend,
                      notes,
                    },
                  },
                  refetchQueries: [
                    { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                  ],
                }).then(toggle);
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Key partner" />
                  <EntityModalBody>
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <KeyPartnerForm {...{ organizationId }} />
                    </Form>
                  </EntityModalBody>
                </Fragment>
              )}
            </EntityModalForm>
          </EntityModalNext>
        )}
      </Mutation>
    )}
  </Query>
);

KeyPartnerAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyPartnerAddModal);
