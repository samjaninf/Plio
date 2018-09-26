import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';
import { Form } from 'reactstrap';
import { pure } from 'recompose';

import { CanvasColors } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateKeyActivity } from '../../../validation';
import CanvasForm from './CanvasForm';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';

const KeyActivitiesAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_KEY_ACTIVITY}>
        {createKeyActivity => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: CanvasColors.INDIGO,
                notes: '',
              }}
              onSubmit={(values) => {
                const errors = validateKeyActivity(values);
                if (errors) return errors;
                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  notes,
                } = values;

                return createKeyActivity({
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      color,
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
                  <EntityModalHeader label="Key activity" />
                  <EntityModalBody>
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <CanvasForm {...{ organizationId }} />
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

KeyActivitiesAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyActivitiesAddModal);
