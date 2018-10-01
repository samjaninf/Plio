import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

import CardHeadingButtons from '../CardHeadingButtons';
import { Pull } from '../Utility';

const Header = styled.div.attrs({
  className: ({ className }) => cx('card-block card-heading modal-window-heading', className),
})`
  border-radius: 4px 4px 0 0;
  max-height: 56px;

  .card-title {
    max-width: calc(100% - 200px);
    line-height: 21px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 auto;
    text-align: center !important;
    font-family: $font-semibold;
  }
`;

const ModalHeader = ({
  children,
  className,
  renderLeftButton,
  renderRightButton,
  ...props
}) => (
  <Header {...props}>
    {renderLeftButton && (
      <Pull left>
        <CardHeadingButtons>
          {renderLeftButton}
        </CardHeadingButtons>
      </Pull>
    )}
    {children}
    {renderRightButton && (
      <Pull right>
        <CardHeadingButtons>
          {renderRightButton}
        </CardHeadingButtons>
      </Pull>
    )}
  </Header>
);

ModalHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  renderLeftButton: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  renderRightButton: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

export default ModalHeader;
