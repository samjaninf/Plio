import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { mapUsersToOptions, lenses } from 'plio-util';
import { setPropTypes, lifecycle } from 'recompose';
import { view } from 'ramda';

import { namedCompose, withPreloader, omitProps } from '../helpers';
import { SelectField } from '../components';
import { Query } from '../../../client/graphql';

export default namedCompose('OrgUsersSelectInputContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
  }),
  graphql(Query.ORGANIZATION_USERS, {
    options: ({ organizationId }) => ({
      variables: { organizationId },
    }),
    props: ({
      ownProps: {
        onError,
        organizationId,
        ...props
      },
      data: {
        loading,
        error,
        organization: {
          users = [],
        } = {},
      },
    }) => ({
      loading,
      error,
      options: mapUsersToOptions(users),
      ...props,
    }),
  }),
  lifecycle({
    componentWillReceiveProps({ error, onError }) {
      if (error && onError) onError(error);
    },
  }),
  withPreloader(view(lenses.loading), () => ({ size: 1 })),
  omitProps(['loading']),
)(SelectField);
