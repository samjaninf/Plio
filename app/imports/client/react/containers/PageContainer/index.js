import { lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import { MOBILE_BREAKPOINT } from '../../../../api/constants';
import { setWindowWidth } from '../../../../client/store/actions/windowActions';
import { pickDeep } from '../../../../api/helpers';
import { getIsFullScreenMode } from '../../../store/selectors/global';
import { namedCompose } from '../../helpers';
import { setIsFullScreenMode } from '../../../../client/store/actions/globalActions';
import Page from '../../components/Page';

export default namedCompose('PageContainer')(
  connect(state => ({
    isFullScreenMode: getIsFullScreenMode(state),
    ...pickDeep(['window.width', 'mobile.showCard', 'discussion.isDiscussionOpened'], state),
  })),
  lifecycle({
    componentDidMount() {
      const $window = $(window);
      const getWidth = () => $window.width();
      const setNewWidth = () =>
        this.props.dispatch(setWindowWidth(getWidth()));
      const setNewWidthThrottled = _.throttle(setNewWidth, 500);

      setNewWidth();

      $window.on('resize', setNewWidthThrottled);
    },
    componentWillUnmount() {
      this.props.dispatch(setIsFullScreenMode(false));
    },
  }),
  mapProps(({
    width, showCard, isDiscussionOpened, ...props
  }) => ({
    ...props,
    displayRHS: width <= MOBILE_BREAKPOINT && (showCard || isDiscussionOpened),
    children: _.isFunction(props.children.filter)
      && props.children.filter(child => Boolean(child))
      || props.children,
  })),
)(Page);
