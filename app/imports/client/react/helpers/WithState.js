import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';

export default class WithState extends React.Component {
  state = {
    ...this.props.initialState,
  }

  static get propTypes() {
    return {
      initialState: PropTypes.object,
      onChange: PropTypes.func,
      children: PropTypes.func.isRequired,
    };
  }

  _setState = (updater, cb = noop) => {
    const { onChange = noop } = this.props;

    this.setState(updater, () => {
      onChange(this.state);
      cb();
    });
  }

  render() {
    return this.props.children({ state: this.state, setState: this._setState });
  }
}
