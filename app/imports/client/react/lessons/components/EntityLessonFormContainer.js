import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions, toDate } from 'plio-util';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateLesson } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';

const EntityLessonFormContainer = ({
  organizationId,
  isOpen,
  toggle,
  documentId,
  documentType,
  refetchQuery,
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
      <Mutation mutation={Mutations.CREATE_LESSON} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createLesson]) => renderComponent({
      ...props,
      isOpen,
      toggle,
      organizationId,
      initialValues: {
        title: '',
        notes: '',
        owner: getUserOptions(user),
        date: moment(),
      },
      onSubmit: (values) => {
        const {
          title,
          date,
          notes,
          owner: { value: owner },
        } = values;

        const errors = validateLesson(values);
        if (errors) return errors;

        return createLesson({
          variables: {
            input: {
              title,
              owner,
              notes,
              organizationId,
              date: toDate(date),
              linkedTo: {
                documentId,
                documentType,
              },
            },
          },
          refetchQueries: [
            { query: refetchQuery, variables: { _id: documentId } },
          ],
        }).then(toggle || noop);
      },
    })}
  </Composer>
);

EntityLessonFormContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EntityLessonFormContainer;
