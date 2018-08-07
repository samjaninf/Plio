import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions } from 'plio-util';

import { swal } from '../../../util';
import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, ApolloSelectInputField } from '../../components';

const ValuePropositionForm = ({ organizationId }) => (
  <CanvasForm {...{ organizationId }}>
    <FormField>
      Matched to
      <ApolloSelectInputField
        name="matchedTo"
        placeholder="Matched to"
        loadOptions={query => query({
          query: Query.CUSTOMER_SEGMENT_LIST,
          variables: { organizationId },
        }).then(({ data: { customerSegments: { customerSegments } } }) => ({
          options: [
            { label: 'None', value: undefined },
            ...mapEntitiesToOptions(customerSegments),
          ],
        })).catch(swal.error)}
      />
    </FormField>
  </CanvasForm>
);

ValuePropositionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default ValuePropositionForm;