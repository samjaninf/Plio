import moment from 'moment';
import { graphql } from 'react-apollo';
import { lifecycle, compose } from 'recompose';

import { Mutation } from '../../graphql';

export default compose(
  graphql(
    Mutation.UPDATE_ORGANIZATION_LAST_ACCESSED_DATE,
    { name: 'updateLastAccessedDate' },
  ),
  lifecycle({
    componentDidMount() {
      const {
        updateLastAccessedDate,
        organization: { _id, lastAccessedDate },
      } = this.props;

      // limit to once a day
      if (!lastAccessedDate || !moment().isSame(lastAccessedDate, 'day')) {
        updateLastAccessedDate({ variables: { input: { _id } } });
      }
    },
  }),
);
