import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';
import { Form } from 'reactstrap';
import { pure } from 'recompose';

import { CanvasColors } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import RevenueStreamForm from './RevenueStreamForm';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateRevenueStream } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';

const RevenueStreamAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_REVENUE_STREAM}>
        {createRevenueStream => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: CanvasColors.INDIGO,
                notes: '',
                percentOfRevenue: null,
                percentOfProfit: null,
              }}
              onSubmit={(values) => {
                const errors = validateRevenueStream(values);

                if (errors) return errors;

                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  percentOfRevenue,
                  percentOfProfit,
                  notes,
                } = values;

                return createRevenueStream({
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      color,
                      notes,
                      percentOfRevenue,
                      percentOfProfit,
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
                  <EntityModalHeader label="Revenue stream" />
                  <EntityModalBody>
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <RevenueStreamForm {...{ organizationId }} />
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

RevenueStreamAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(RevenueStreamAddModal);
