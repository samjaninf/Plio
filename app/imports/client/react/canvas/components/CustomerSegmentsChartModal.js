import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { pure } from 'recompose';
import { pluck, pathOr } from 'ramda';
import { sortByIds, noop } from 'plio-util';

import { Query as Queries } from '../../../graphql';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';
import {
  RenderSwitch,
  PreloaderPage,
  EntityModalHeader,
  EntityModalBody,
  ChartModal,
} from '../../components';
import CanvasDoughnutChart from './CanvasDoughnutChart';

const getChartData = ({
  customerSegments: { customerSegments },
  canvasSettings: { canvasSettings },
}) => {
  const order = pathOr([], [CanvasSections[CanvasTypes.CUSTOMER_SEGMENT], 'order'], canvasSettings);
  const orderedCustomerSegments = sortByIds(order, customerSegments);
  return {
    data: pluck('percentOfMarketSize', orderedCustomerSegments),
    labels: pluck('title', orderedCustomerSegments),
  };
};

const CustomerSegmentsChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.CUSTOMER_SEGMENTS_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ loading, error, data }) => (
      <ChartModal
        {...{ isOpen, toggle, error }}
        guidance="Customer segments"
        noForm
      >
        <EntityModalHeader label="Customer segments" />
        <EntityModalBody>
          <RenderSwitch
            {...{ loading, error }}
            errorWhenMissing={noop}
            require={data && data.customerSegments}
            renderLoading={<PreloaderPage />}
          >
            {() => (
              <CanvasDoughnutChart
                {...getChartData(data)}
                title="% of market"
              />
            )}
          </RenderSwitch>
        </EntityModalBody>

      </ChartModal>
    )}
  </Query>
);

CustomerSegmentsChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerSegmentsChartModal);
