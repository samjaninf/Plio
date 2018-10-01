import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

import introspectionQueryResultData from '../../../fragmentTypes.json';

const GRAPHQL_URL = Meteor.settings.public.graphql.url;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const httpLink = new BatchHttpLink({ uri: GRAPHQL_URL });
const meteorAccountsLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'meteor-login-token': Accounts._storedLoginToken(),
    },
  });
  return forward(operation);
});

const link = meteorAccountsLink.concat(httpLink);
const cache = new InMemoryCache({
  fragmentMatcher,
}).restore(window.__APOLLO_STATE__);

const client = new ApolloClient({
  link,
  cache,
});

export default client;
