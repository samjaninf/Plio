import { FlowRouter } from 'meteor/kadira:flow-router';

import { composeWithTracker } from '../../../util';

const onPropsChange = (props, onData) => {
  const { getParam, getQueryParam, getRouteName } = props;
  const data = { router: FlowRouter };

  if (getParam) Object.assign(data, { [getParam]: FlowRouter.getParam(getParam) });
  if (getQueryParam) {
    Object.assign(data, { [getQueryParam]: FlowRouter.getQueryParam(getQueryParam) });
  }
  if (getRouteName) Object.assign(data, { routeName: FlowRouter.getRouteName() });

  return onData(null, data);
};

export default composeWithTracker(onPropsChange)(({ children, ...props }) => children(props));
