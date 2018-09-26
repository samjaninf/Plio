import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import CustomerRelationshipAddModal from './CustomerRelationshipAddModal';
import CustomerRelationshipEditModal from './CustomerRelationshipEditModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

const CustomerRelationships = ({ organizationId }) => (
  <Query
    query={Queries.CUSTOMER_RELATIONSHIPS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { customerRelationships: { customerRelationships = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Customer relationships"
        sectionName={CanvasSections[CanvasTypes.CUSTOMER_RELATIONSHIP]}
        help={(
          <Fragment>
            <p>What type of relationship do you want with customers?</p>
            <p>Which fits best with each segment?</p>
          </Fragment>
        )}
        items={customerRelationships}
        renderModal={({ isOpen, toggle }) => (
          <CustomerRelationshipAddModal {...{ isOpen, toggle, organizationId }} />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <CustomerRelationshipEditModal
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

CustomerRelationships.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerRelationships);
