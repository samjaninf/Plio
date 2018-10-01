import PropTypes from 'prop-types';
import React from 'react';

import SwitchView from '../../components/SwitchView';

const SwitchViewAdapter = ({
  input,
  onChange,
  children,
  ...rest
}) => (
  <SwitchView
    {...{ ...input, ...rest }}
    active={input.value}
    onChange={(idx) => {
      input.onChange(idx);
      if (onChange) onChange(idx);
    }}
    asField
  >
    {children}
  </SwitchView>
);

SwitchViewAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default SwitchViewAdapter;
