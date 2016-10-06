import './discussion-react.html';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import DiscussionContainer from './containers/DiscussionContainer';
import store from '/client/redux/store';
import { Messages } from '/imports/api/messages/messages';
import Container from './containers/MessagesListWrapperContainer';

Template.Discussion_React.viewmodel({
  // messages: [],
  // onCreated(template) {
  //   const p1 = performance.now();
  //
  //   template.subscribe('msgs', template.data.discussionId, {
  //     onReady: () => {
  //       const p2 = performance.now();
  //
  //       console.log(p2 - p1);
  //
  //       const messages = Messages.find().fetch();
  //
  //       this.messages(messages);
  //     }
  //   });
  // }
  onRendered(template) {
    const { discussionId, organizationId, standard } = template.data;

    ReactDOM.render(
      <Provider store={store}>
        <DiscussionContainer discussionId={discussionId}
                             organizationId={organizationId}
                             standard={standard} />
      </Provider>,
      template.$('#discussion')[0]
    );
  },
  onDestroyed(template) {
    ReactDOM.unmountComponentAtNode(template.$('#discussion')[0]);
  }
});
