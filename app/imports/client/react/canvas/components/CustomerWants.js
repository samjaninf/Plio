import PropTypes from 'prop-types';
import React from 'react';
import { Mutation } from 'react-apollo';
import { pure } from 'recompose';
import { noop } from 'plio-util';

import {
  EntityManager,
  EntityManagerForms,
  EntityManagerAddButton,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerItem,
  EntityManagerForm,
} from '../../components';
import CustomerElementSubcard from './CustomerElementSubcard';
import CustomerElementForm from './CustomerElementForm';
import { validateCustomerElement } from '../../../validation';
import { Mutation as Mutations, Query as Queries } from '../../../graphql';
import { getCustomerElementInitialValues } from '../helpers';
import { Composer } from '../../helpers';
import { swal } from '../../../util';

const CustomerWants = ({
  wants,
  documentId,
  documentType,
  organizationId,
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.CREATE_WANT} children={noop} />,
      <Mutation mutation={Mutations.UPDATE_WANT} children={noop} />,
      <Mutation mutation={Mutations.DELETE_WANT} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([createWant, updateWant, deleteWant]) => (
      <EntityManager>
        {wants.map(want => (
          <EntityManagerItem
            key={want._id}
            itemId={want._id}
            customerElement={want}
            component={CustomerElementSubcard}
            onUpdate={updateWant}
            onDelete={() => swal.promise(
              {
                text: `The customer want "${want.title}" will be deleted`,
                confirmButtonText: 'Delete',
                successTitle: 'Deleted!',
                successText: `The customer want "${want.title}" was deleted successfully.`,
              },
              () => deleteWant({
                variables: {
                  input: { _id: want._id },
                },
                refetchQueries: [{
                  query: Queries.CUSTOMER_SEGMENT_CARD,
                  variables: { organizationId, _id: documentId },
                }],
              }),
            )}
          />
        ))}
        <EntityManagerForms>
          <EntityManagerCards
            label="New customer want"
            component={EntityManagerForm}
            render={EntityManagerCard}
            initialValues={getCustomerElementInitialValues()}
            onSubmit={(values) => {
              const errors = validateCustomerElement(values);

              if (errors) return errors;

              const {
                title,
                description,
                importance,
              } = values;

              return createWant({
                variables: {
                  input: {
                    organizationId,
                    title,
                    description,
                    importance,
                    linkedTo: [{
                      documentId,
                      documentType,
                    }],
                  },
                },
                refetchQueries: [{
                  query: Queries.CUSTOMER_SEGMENT_CARD,
                  variables: { _id: documentId, organizationId },
                }],
              });
            }}
          >
            <CustomerElementForm />
          </EntityManagerCards>
          <EntityManagerAddButton>Add a customer want</EntityManagerAddButton>
        </EntityManagerForms>
      </EntityManager>
    )}
  </Composer>
);

CustomerWants.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  wants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default pure(CustomerWants);
