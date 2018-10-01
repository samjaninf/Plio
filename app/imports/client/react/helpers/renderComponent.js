/* eslint-disable react/no-children-prop */

import PropTypes from 'prop-types';
import React from 'react';
import { is } from 'ramda';

const renderComponent = (props) => {
  const {
    render,
    children,
    component,
    ...rest
  } = props;

  if (component) {
    return React.createElement(component, { ...rest, children, render });
  }

  if (render) {
    return render({ ...rest, children });
  }

  if (is(Function, children)) {
    return children(rest);
  }

  return children;
};

renderComponent.propTypes = {
  render: PropTypes.func,
  component: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default renderComponent;
