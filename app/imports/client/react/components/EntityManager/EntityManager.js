import PropTypes from 'prop-types';
import React, { Component, createContext } from 'react';

import { renderComponent } from '../../helpers';

const { Provider, Consumer } = createContext({});

export { Consumer };

export default class EntityManager extends Component {
  static propTypes = {
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  state = { active: this.props.active || null }

  toggle = (value) => {
    const isActive = this.state.active === value;
    this.setState({ active: isActive ? null : value });
  }

  render() {
    return (
      <Provider value={{ state: this.state, toggle: this.toggle }}>
        {renderComponent({ ...this.props, ...this.state, toggle: this.toggle })}
      </Provider>
    );
  }
}
