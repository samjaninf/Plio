import PropTypes from 'prop-types';
import React, { Component, createContext } from 'react';
import { omit, keys } from 'ramda';

import { renderComponent } from '../../helpers';
import { Modal, ModalProvider } from '../Modal';

const { Provider, Consumer } = createContext({});

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  noForm: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  guidance: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onDelete: PropTypes.func,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

const omitProps = omit([...keys(propTypes), ...keys(Modal.propTypes)]);

export { Consumer };

export default class EntityModal extends Component {
  static propTypes = propTypes

  static defaultProps = {
    error: '',
  }

  state = { isGuidanceOpen: false }

  toggleGuidance = () => {
    this.setState({ isGuidanceOpen: !this.state.isGuidanceOpen });
  }

  render() {
    const {
      isOpen,
      toggle,
      loading,
      error,
      isEditMode,
      onDelete,
      component,
      render,
      children,
      guidance,
      noForm,
      ...rest
    } = this.props;

    const value = {
      state: this.state,
      toggleGuidance: this.toggleGuidance,
      isOpen,
      toggle,
      loading,
      error,
      isEditMode,
      onDelete,
      guidance,
      noForm,
    };

    return (
      <ModalProvider
        {...{ isOpen, toggle }}
      >
        <Modal {...rest}>
          <Provider {...{ value }}>
            {renderComponent({
              ...omitProps(rest),
              ...this.state,
              toggleGuidance: this.toggleGuidance,
              component,
              render,
              children,
              form: { form: {} }, // TEMP
            })}
          </Provider>
        </Modal>
      </ModalProvider>
    );
  }
}
