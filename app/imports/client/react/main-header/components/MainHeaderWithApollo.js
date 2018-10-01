import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { client } from '../../../apollo';
import MainHeader from './MainHeader';

const MainHeaderWithApollo = props => (
  <ApolloProvider {...{ client }}>
    <MainHeader {...props} />
  </ApolloProvider>
);

export default MainHeaderWithApollo;
