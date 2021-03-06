import { noop } from 'plio-util';
import ReactDOM from 'react-dom';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// when redirecting from blaze to react screen and wise-versa
// they conflict with each other
FlowRouter.triggers.enter([
  (context) => {
    const { path } = context;
    const { oldRoute: { path: prevPath } = {} } = context;

    if (prevPath) {
      const [,, prevRoute] = prevPath.match(/(:orgSerialNumber\/)([A-Za-z-]+)/) || [];
      const [,, route] = path.match(/(\d+\/)([A-Za-z-]+)/) || [];
      switch (prevRoute) {
        case 'standards':
        case 'risks':
          switch (route) {
            case 'work-inbox':
            case 'non-conformities':
              ReactDOM.unmountComponentAtNode(document.getElementById('app'));
              BlazeLayout.reset();
              break;
            default: noop();
          }
          break;
        case 'work-inbox':
          switch (route) {
            case 'standards':
            case 'risks':
            case 'non-conformities':
              BlazeLayout.reset();
              break;
            default: noop();
          }
          break;
        default: noop();
      }
    }
  },
]);
