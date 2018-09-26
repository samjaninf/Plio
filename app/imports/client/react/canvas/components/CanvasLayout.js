import React, { Fragment } from 'react';
import { ApolloProvider, Query } from 'react-apollo';

import { client } from '../../../apollo';
import { Query as Queries } from '../../../graphql';
import {
  PreloaderPage,
  FlowRouterContext,
  RenderSwitch,
  NotFoundPage,
  ErrorPage,
} from '../../components';
import Errors from '../../../../share/errors';
import MainHeader from '../../main-header/components/MainHeader';
import CanvasPage from './CanvasPage';

const CanvasLayout = () => (
  <ApolloProvider {...{ client }}>
    <FlowRouterContext getParam="orgSerialNumber">
      {({ orgSerialNumber }) => (
        <Query
          query={Queries.CANVAS_LAYOUT}
          variables={{ orgSerialNumber }}
          skip={!orgSerialNumber}
        >
          {({ loading, error, data }) => (
            <RenderSwitch
              {...{ loading, error }}
              require={data && data.organization}
              renderLoading={<PreloaderPage />}
              renderError={queryError =>
                queryError === Errors.NOT_ORG_MEMBER ? (
                  <NotFoundPage
                    subject="organization"
                    subjectId={orgSerialNumber}
                  />
                ) : (
                  <ErrorPage error={queryError} />
                )
              }
            >
              {organization => (
                <Fragment>
                  <MainHeader {...{ organization }} />
                  <CanvasPage {...{ organization }} />
                </Fragment>
              )}
            </RenderSwitch>
          )}
        </Query>
      )}
    </FlowRouterContext>
  </ApolloProvider>
);

export default CanvasLayout;
