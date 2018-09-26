import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { lifecycle, defaultProps, compose } from 'recompose';

import { Styles } from '../../../../api/constants';
import { Collapse, CardBlock, Icon } from '../../components';

const enhance = compose(
  defaultProps({
    scroll: true,
  }),
  lifecycle({
    componentDidUpdate({ errorText }) {
      if (
        this.props.errorText &&
        this.props.scroll &&
        this.props.errorText !== errorText
      ) {
        document.getElementsByClassName('modal-error-section')[0].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
  }),
);

const DefaultTag = styled.pre`
  font-family: ${Styles.font.family.segoe.regular};
  font-size: 100%;
`;

export const ErrorSection = ({
  errorText,
  size = '4',
  className,
  scroll, // eslint-disable-line no-unused-vars
  tag: Tag = DefaultTag,
  ...props
}) => (
  <Collapse
    className={cx('modal-error-section', className)}
    isOpen={!!errorText}
    {...props}
  >
    <CardBlock>
      <Icon {...{ size }} name="exclamation-circle" aria-hidden="true" />
      {errorText && (<Tag>{errorText}</Tag>)}
    </CardBlock>
  </Collapse>
);

ErrorSection.propTypes = {
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.string,
  className: PropTypes.string,
  scroll: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default enhance(ErrorSection);
