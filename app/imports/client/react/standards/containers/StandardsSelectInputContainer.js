import PropTypes from 'prop-types';
import { mapRejectedEntitiesToOptions } from 'plio-util';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';

import { namedCompose } from '../../helpers';
import { SelectInput } from '../../components';
import { Query } from '../../../graphql';
import { client } from '../../../apollo';

export default namedCompose('StandardsSelectInputContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
  }),
  defaultProps({
    component: SelectInput,
    loadOptionsOnOpen: true,
    backspaceRemoves: false,
  }),
  withHandlers({
    loadOptions: ({ organizationId, standards }) => () => client.query({
      query: Query.STANDARD_LIST,
      variables: { organizationId },
    }).then(({
      data: {
        standards: {
          standards: resultStandards,
        },
      },
    }) => ({
      options: mapRejectedEntitiesToOptions(standards, resultStandards),
    })),
  }),
)(componentFromProp('component'));
