import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import styled from 'styled-components';
import 'rc-slider/assets/index.css';

import { Styles } from '../../../../api/constants';
import { Pull } from '../../components';
import SliderHandle from './SliderHandle';

const StyledSlider = styled(Slider)`
  &.rc-slider {
    padding: 15px 0;
  }
  .rc-slider-track {
    background-color: ${Styles.color.lightBlue};
  }
  .rc-slider-handle,
  .rc-slider-handle-click-focused:focus {
    border-color: ${Styles.color.lightBlue};
    background-color: ${Styles.color.lightBlue};
  }
  .rc-slider-handle:hover {
    border-color: ${Styles.color.hoverLightBlue};
    background-color: ${Styles.color.hoverLightBlue};
  }
`;

const Wrapper = styled.div`
  display: flex;
  .pull-xs-left, .pull-xs-right {
    padding: .375rem 0;
    font-family: ${Styles.font.family.segoe.semibold};
  }
  .pull-xs-left {
    margin-right: 10px;
  }
  .pull-xs-right {
    margin-left: 10px;
  }
`;

const SliderInput = ({
  leftLabel,
  rightLabel,
  tipFormatter,
  ...rest
}) => (
  <Wrapper>
    {leftLabel && (
      <Pull left>
        <span>{leftLabel}</span>
      </Pull>
    )}
    <StyledSlider
      {...rest}
      handle={({ ref, ...handleProps }) => (
        <SliderHandle
          id={rest.name}
          tipFormatter={rest.tipFormatter}
          {...{ tipFormatter, ...handleProps }}
        />
      )}
    />
    {rightLabel && (
      <Pull right>
        <span>{rightLabel}</span>
      </Pull>
    )}
  </Wrapper>
);

SliderInput.propTypes = {
  leftLabel: PropTypes.string,
  rightLabel: PropTypes.string,
  tipFormatter: PropTypes.func,
};

export default SliderInput;
