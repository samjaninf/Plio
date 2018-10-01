import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import KeyActivityAddModal from './KeyActivityAddModal';
import KeyActivityEditModal from './KeyActivityEditModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

const KeyActivities = ({ organizationId }) => (
  <Query
    query={Queries.KEY_ACTIVITIES}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { keyActivities: { keyActivities = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Key activities"
        sectionName={CanvasSections[CanvasTypes.KEY_ACTIVITY]}
        help={(
          <p>What are the key activities we need to create our value propositions?</p>
        )}
        items={keyActivities}
        renderModal={({ isOpen, toggle }) => (
          <KeyActivityAddModal {...{ isOpen, toggle, organizationId }} />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <KeyActivityEditModal
            {...{
              isOpen,
              toggle,
              organizationId,
              _id,
            }}
          />
        )}
      />
    )}
  </Query>
);

KeyActivities.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyActivities);
