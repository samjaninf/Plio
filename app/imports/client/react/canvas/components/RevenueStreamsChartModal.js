import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { pure } from 'recompose';
import { pluck, pathOr } from 'ramda';
import { sortByIds, noop } from 'plio-util';

import { WithState } from '../../helpers';
import { Query as Queries } from '../../../graphql';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';
import {
  RenderSwitch,
  PreloaderPage,
  EntityModalHeader,
  EntityModalBody,
  SwitchView,
  ChartModal,
} from '../../components';
import CanvasDoughnutChart from './CanvasDoughnutChart';

const chartTabs = {
  PERCENT_OF_REVENUE: 0,
  PERCENT_OF_PROFIT: 1,
};

const getChartData = (
  dataFieldName,
  {
    revenueStreams: { revenueStreams },
    canvasSettings: { canvasSettings },
  },
) => {
  const order = pathOr([], [CanvasSections[CanvasTypes.REVENUE_STREAM], 'order'], canvasSettings);
  const orderedRevenueStreams = sortByIds(order, revenueStreams);
  return {
    data: pluck(dataFieldName, orderedRevenueStreams),
    labels: pluck('title', orderedRevenueStreams),
  };
};

const StyledSwitchView = styled(SwitchView)`
  .form-group {
    margin-bottom: 0
  }
`;

const RevenueStreamsChartModal = ({ isOpen, toggle, organizationId }) => (
  <WithState
    initialState={{
      activeTab: chartTabs.PERCENT_OF_REVENUE,
      error: null,
    }}
  >
    {({ state, setState }) => (
      <ChartModal
        {...{ isOpen, toggle }}
        error={state.error}
        guidance="Revenue streams"
        bodyHeight="calc(100vh - 185px)"
        noForm
      >
        <EntityModalHeader label="Revenue streams" />
        <EntityModalBody>
          <StyledSwitchView
            active={state.activeTab}
            onChange={idx => setState({ activeTab: idx, error: null })}
            buttons={[
              <span key="revenue">% of revenue</span>,
              <span key="profit">% of profit</span>,
            ]}
          >
            <Query
              query={Queries.REVENUE_STREAMS_CHART}
              variables={{ organizationId }}
              skip={state.activeTab !== chartTabs.PERCENT_OF_REVENUE}
              onError={error => setState({ error })}
              key="revenue"
            >
              {({ loading, data, error }) => (
                <RenderSwitch
                  {...{ loading, error }}
                  errorWhenMissing={noop}
                  require={data && data.revenueStreams}
                  renderLoading={<PreloaderPage />}
                >
                  {() => (
                    <CanvasDoughnutChart
                      {...getChartData('percentOfRevenue', data)}
                      valueLabel="% of revenue"
                    />
                  )}
                </RenderSwitch>
              )}
            </Query>
            <Query
              query={Queries.REVENUE_STREAMS_PROFIT_CHART}
              variables={{ organizationId }}
              skip={state.activeTab !== chartTabs.PERCENT_OF_PROFIT}
              onError={error => setState({ error })}
              key="profit"
            >
              {({ loading, data, error }) => (
                <RenderSwitch
                  {...{ loading, error }}
                  errorWhenMissing={noop}
                  require={data && data.revenueStreams}
                  renderLoading={<PreloaderPage />}
                >
                  {() => (
                    <CanvasDoughnutChart
                      {...getChartData('percentOfProfit', data)}
                      valueLabel="% of profit"
                    />
                  )}
                </RenderSwitch>
              )}
            </Query>
          </StyledSwitchView>
        </EntityModalBody>
      </ChartModal>
    )}
  </WithState>
);

RevenueStreamsChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(RevenueStreamsChartModal);
