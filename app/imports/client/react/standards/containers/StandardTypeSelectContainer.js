import PropTypes from 'prop-types';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';
import { compose, sort, map } from 'ramda';
import { byTitle } from 'plio-util';

import { namedCompose, omitProps } from '../../helpers';
import { Select } from '../../components';
import { Query } from '../../../graphql';
import { client } from '../../../apollo';

const getOptions = compose(
  map(({ _id, title, abbreviation }) => ({
    text: `${title}${abbreviation ? ` (${abbreviation})` : ''}`,
    value: _id,
  })),
  sort(byTitle),
);

export default namedCompose('StandardTypeSelectContainer')(
  setPropTypes({ organizationId: PropTypes.string.isRequired }),
  defaultProps({ component: Select }),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.STANDARD_TYPE_LIST,
      variables: { organizationId },
    }).then(({
      data: {
        standardTypes: {
          standardTypes,
        },
      },
    }) => ({
      options: getOptions(standardTypes),
    })),
  }),
  omitProps(['organizationId']),
)(componentFromProp('component'));
