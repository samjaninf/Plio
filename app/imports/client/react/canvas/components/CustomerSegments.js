import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import CustomerSegmentAddModal from './CustomerSegmentAddModal';
import CustomerSegmentEditModal from './CustomerSegmentEditModal';
import CustomerSegmentsChartModal from './CustomerSegmentsChartModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

const CustomerSegments = ({ organizationId }) => (
  <Query
    query={Queries.CUSTOMER_SEGMENTS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { customerSegments: { customerSegments = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Customer segments"
        sectionName={CanvasSections[CanvasTypes.CUSTOMER_SEGMENT]}
        help={(
          <Fragment>
            <p>For whom are we creating value?</p>
            <p>Who are our most important customers?</p>
          </Fragment>
        )}
        items={customerSegments}
        renderModal={({ isOpen, toggle }) => (
          <CustomerSegmentAddModal {...{ isOpen, toggle, organizationId }} />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <CustomerSegmentEditModal
            {...{
              isOpen,
              toggle,
              organizationId,
              _id,
            }}
          />
        )}
        renderChartModal={({ isOpen, toggle }) => (
          <CustomerSegmentsChartModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

CustomerSegments.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerSegments);
