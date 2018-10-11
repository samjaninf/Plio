import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop, getValues, mapUsersToOptions } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCustomerRelationship } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CanvasForm from './CanvasForm';
import CanvasFilesSubcard from './CanvasFilesSubcard';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
  NotifySubcard,
} from '../../components';

const getCustomerRelationship = pathOr({}, repeat('customerRelationship', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  pick([
    'originator',
    'title',
    'color',
    'notes',
    'notify',
  ]),
  getCustomerRelationship,
);

const CustomerRelationshipEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            query={Queries.CUSTOMER_RELATIONSHIP_CARD}
            variables={{ _id }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_CUSTOMER_RELATIONSHIP} children={noop} />,
          <Mutation mutation={Mutations.DELETE_CUSTOMER_RELATIONSHIP} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateCustomerRelationship, deleteCustomerRelationship]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            guidance="Customer relationship"
            onDelete={() => {
              const { title } = getCustomerRelationship(data);
              swal.promise(
                {
                  text: `The customer relationship "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The customer relationship "${title}" was deleted successfully.`,
                },
                () => deleteCustomerRelationship({
                  variables: { input: { _id } },
                  refetchQueries: [
                    { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                  ],
                }).then(toggle),
              );
            }}
          >
            <EntityModalForm
              {...{ initialValues }}
              validate={validateCustomerRelationship}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator,
                  color,
                  notes = '',
                  notify = [],
                } = values;

                return updateCustomerRelationship({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      notify: getValues(notify),
                      originatorId: originator.value,
                    },
                  },
                }).then(noop).catch((err) => {
                  form.reset(currentValues);
                  throw err;
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Customer relationship" />
                  <EntityModalBody>
                    <RenderSwitch
                      require={data.customerRelationship &&
                        data.customerRelationship.customerRelationship}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<CanvasForm {...{ organizationId }} />}
                    >
                      {({ _id: documentId }) => (
                        <Fragment>
                          <CanvasForm {...{ organizationId }} save={handleSubmit} />
                          <CanvasFilesSubcard
                            {...{ documentId, organizationId }}
                            onUpdate={updateCustomerRelationship}
                            slingshotDirective={AWSDirectives.CUSTOMER_RELATIONSHIP_FILES}
                            documentType={CanvasTypes.CUSTOMER_RELATIONSHIP}
                          />
                          <NotifySubcard
                            {...{ documentId, organizationId }}
                            onChange={handleSubmit}
                          />
                        </Fragment>
                      )}
                    </RenderSwitch>
                  </EntityModalBody>
                </Fragment>
              )}
            </EntityModalForm>
          </EntityModalNext>
        )}
      </Composer>
    )}
  </WithState>
);

CustomerRelationshipEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(CustomerRelationshipEditModal);
