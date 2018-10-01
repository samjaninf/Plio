import PropTypes from 'prop-types';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';
import cx from 'classnames';

import {
  TransitionBaseActiveClass,
  TransitionTimeouts,
} from '../../../../api/constants';
import { renderComponent } from '../../helpers';
import { ModalConsumer } from './ModalContext';

const Modal = ({
  component,
  render,
  children,
  className,
  contentClassName,
  modalTransition,
  backdropTransition,
  onClosed,
  ...props
}) => (
  <ModalConsumer>
    {modal => (
      <ReactstrapModal
        {...props}
        isOpen={modal.isOpen}
        toggle={modal.toggle}
        onClosed={() => {
          modal.reset();
          if (onClosed) onClosed();
        }}
        className={cx('content-cards', className)}
        contentClassName={cx('card', contentClassName)}
        modalTransition={{
          baseClassActive: TransitionBaseActiveClass,
          timeout: TransitionTimeouts.modal,
          ...modalTransition,
        }}
        backdropTransition={{
          baseClassActive: TransitionBaseActiveClass,
          timeout: TransitionTimeouts.modal,
          ...backdropTransition,
        }}
      >
        {renderComponent({
          ...modal,
          children,
          component,
          render,
        })}
      </ReactstrapModal>
    )}
  </ModalConsumer>
);

Modal.propTypes = {
  ...ReactstrapModal.propTypes,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  modalTransition: PropTypes.object,
  backdropTransition: PropTypes.object,
  backdrop: PropTypes.string,
  keyboard: PropTypes.bool,
  onClosed: PropTypes.func,
};

Modal.defaultProps = {
  backdrop: 'static',
  keyboard: false,
};

export default Modal;
