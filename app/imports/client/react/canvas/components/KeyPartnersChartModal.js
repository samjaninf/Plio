import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { pure } from 'recompose';
import { map, addIndex, pathOr } from 'ramda';
import { noop, sortByIds } from 'plio-util';

import { Query as Queries } from '../../../graphql';
import { Colors, CanvasSections, CanvasTypes } from '../../../../share/constants';
import { CanvasBubbleChartSize, CriticalityLabels } from '../../../../api/constants';
import { getCriticalityValueLabel } from '../helpers';
import {
  RenderSwitch,
  PreloaderPage,
  EntityModalHeader,
  EntityModalBody,
  LoadableBubbleChart,
  CardBlock,
  ChartModal,
} from '../../components';

const palette = Object.values(Colors);

const getChartData = ({
  keyPartners: { keyPartners },
  canvasSettings: { canvasSettings },
} = {}) => {
  const order = pathOr([], [CanvasSections[CanvasTypes.KEY_PARTNER], 'order'], canvasSettings);
  const orderedKeyPartners = sortByIds(order, keyPartners);
  return addIndex(map)(({
    levelOfSpend,
    criticality,
    title,
  }, index) => ({
    data: [{ x: levelOfSpend, y: criticality }],
    backgroundColor: palette[index % palette.length],
    label: title,
  }), orderedKeyPartners);
};

const KeyPartnersChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.KEY_PARTNERS_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ loading, error, data }) => (
      <ChartModal
        {...{ isOpen, toggle, error }}
        guidance="Key partners"
        noForm
      >
        <EntityModalHeader label="Key partners" />
        <EntityModalBody>
          <RenderSwitch
            {...{ loading, error }}
            errorWhenMissing={noop}
            require={data && data.keyPartners}
            renderLoading={<PreloaderPage />}
          >
            {() => (
              <CardBlock>
                <LoadableBubbleChart
                  width={CanvasBubbleChartSize.WIDTH}
                  height={CanvasBubbleChartSize.HEIGHT}
                  xScaleLabels={[CriticalityLabels.LOW, '', CriticalityLabels.HIGH]}
                  yScaleLabels={[CriticalityLabels.HIGH, '', CriticalityLabels.LOW]}
                  xTitle="Spend"
                  yTitle="Criticality"
                  data={{ datasets: getChartData(data) }}
                  valueFormatter={getCriticalityValueLabel}
                />
              </CardBlock>
            )}
          </RenderSwitch>
        </EntityModalBody>
      </ChartModal>
    )}
  </Query>
);

KeyPartnersChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyPartnersChartModal);
