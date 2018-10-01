import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions, getEntityOptions } from 'plio-util';
import { pure } from 'recompose';

import { swal } from '../../../util';
import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, ApolloSelectInputField } from '../../components';
import { OptionNone, ApolloFetchPolicies } from '../../../../api/constants';

const ValuePropositionForm = ({
  organizationId,
  matchedTo,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <ApolloSelectInputField
        name="matchedTo"
        placeholder="Matched to"
        onChange={save}
        loadOptions={query => query({
          query: Query.CUSTOMER_SEGMENT_LIST,
          variables: { organizationId, isUnmatched: true },
          // network only is needed because after matching an item
          // the data would become inconsistent
          fetchPolicy: ApolloFetchPolicies.NETWORK_ONLY,
        }).then(({ data: { customerSegments: { customerSegments } } }) => {
          const options = [OptionNone];

          if (matchedTo) options.push(getEntityOptions(matchedTo));

          options.push(...mapEntitiesToOptions(customerSegments));

          return { options };
        }).catch(swal.error)}
      />
    </FormField>
  </CanvasForm>
);

ValuePropositionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  matchedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  save: PropTypes.func,
};

export default pure(ValuePropositionForm);
