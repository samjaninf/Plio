import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { getEntityOptions } from 'plio-util';

import { swal } from '../../../util';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { DepartmentsSelectInputContainer } from '../../containers';

const DepartmentsCreatableField = props => (
  <Mutation mutation={Mutations.CREATE_DEPARTMENT}>
    {createDepartment => (
      <DepartmentsSelectInputContainer
        {...props}
        onNewOptionClick={({ value }, callback) => swal.promise({
          title: 'Are you sure?',
          text: `New department/sector "${value}" will be added.`,
          confirmButtonText: 'Add',
          successTitle: 'Added!',
          successText: `New department/sector "${value}" was added successfully`,
        }, () => createDepartment({
          variables: {
            input: {
              organizationId: props.organizationId,
              name: value,
            },
          },
          refetchQueries: [
            {
              query: Queries.DEPARTMENT_LIST,
              variables: { organizationId: props.organizationId },
            },
          ],
        }).then(({ data: { createDepartment: { department } } }) =>
          callback(getEntityOptions(department))))}
      />
    )}
  </Mutation>
);

DepartmentsCreatableField.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default DepartmentsCreatableField;
