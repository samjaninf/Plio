import React from 'react';
import PropTypes from 'prop-types';
import { mapProps, branch, compose } from 'recompose';
import { prop, identity } from 'ramda';

import { withToggle } from '../helpers';
import SubcardHeader from './SubcardHeader';
import SubcardBody from './SubcardBody';

const enhance = compose(
  branch(
    prop('disabled'),
    mapProps(props => ({ ...props, isOpen: true, toggle: () => null })),
    identity,
  ),
  withToggle(),
  mapProps(({
    children,
    isOpen,
    toggle,
    ...props
  }) => ({
    ...props,
    children: React.Children.map(children, (child) => {
      switch (child && child.type) {
        case SubcardHeader:
          return React.cloneElement(child, { isOpen, onClick: toggle });
        case SubcardBody:
          return React.cloneElement(child, { isOpen });
        default:
          return child;
      }
    }),
  })),
);

const Subcard = enhance(({ children }) => children);

Subcard.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default Subcard;
