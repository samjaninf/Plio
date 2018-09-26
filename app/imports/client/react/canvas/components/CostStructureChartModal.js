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
  costLines: { costLines },
  canvasSettings: { canvasSettings },
}) => {
  const order = pathOr([], [CanvasSections[CanvasTypes.COST_LINE], 'order'], canvasSettings);
  const orderedCostLines = sortByIds(order, costLines);
  return {
    data: pluck('percentOfTotalCost', orderedCostLines),
    labels: pluck('title', orderedCostLines),
  };
};

const CostStructureChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.COST_LINES_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ error, loading, data }) => (
      <ChartModal
        {...{ isOpen, toggle, error }}
        guidance="Cost Structure"
        noForm
      >
        <EntityModalHeader label="Cost Structure" />
        <EntityModalBody>
          <RenderSwitch
            {...{ loading, error }}
            errorWhenMissing={noop}
            require={data && data.costLines}
            renderLoading={<PreloaderPage />}
          >
            {() => (
              <CanvasDoughnutChart
                {...getChartData(data)}
                title="% of total costs"
              />
            )}
          </RenderSwitch>
        </EntityModalBody>
      </ChartModal>
    )}
  </Query>
);

CostStructureChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CostStructureChartModal);
