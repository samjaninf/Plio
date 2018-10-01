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

const Benefits = ({
  documentId,
  documentType,
  organizationId,
  benefits,
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.CREATE_BENEFIT} children={noop} />,
      <Mutation mutation={Mutations.UPDATE_BENEFIT} children={noop} />,
      <Mutation mutation={Mutations.DELETE_BENEFIT} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([createBenefit, updateBenefit, deleteBenefit]) => (
      <EntityManager>
        {benefits.map(benefit => (
          <EntityManagerItem
            key={benefit._id}
            entity={benefit}
            customerElement={benefit}
            component={CustomerElementSubcard}
            onUpdate={updateBenefit}
            onDelete={() => swal.promise(
              {
                text: `The benefit "${benefit.title}" will be deleted`,
                confirmButtonText: 'Delete',
                successTitle: 'Deleted!',
                successText: `The benefit "${benefit.title}" was deleted successfully.`,
              },
              () => deleteBenefit({
                variables: {
                  input: { _id: benefit._id },
                },
                refetchQueries: [{
                  query: Queries.VALUE_PROPOSITION_CARD,
                  variables: { organizationId, _id: documentId },
                }],
              }),
            )}
          />
        ))}
        <EntityManagerForms>
          <EntityManagerCards
            label="New benefit"
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

              return createBenefit({
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
                  query: Queries.VALUE_PROPOSITION_CARD,
                  variables: { _id: documentId, organizationId },
                }],
              });
            }}
          >
            <CustomerElementForm />
          </EntityManagerCards>
          <EntityManagerAddButton>Add a benefit</EntityManagerAddButton>
        </EntityManagerForms>
      </EntityManager>
    )}
  </Composer>
);

Benefits.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default pure(Benefits);
