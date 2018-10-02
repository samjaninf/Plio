import { allPass, view } from 'ramda';
import { lenses, lensNotEq } from 'plio-util';
import { NetworkStatus } from 'apollo-client';

import withPreloaderPage from './withPreloaderPage';

export default ({ size = 2 } = {}) => withPreloaderPage(
  allPass([
    view(lenses.loading),
    lensNotEq(lenses.networkStatus, NetworkStatus.fetchMore),
    lensNotEq(lenses.networkStatus, NetworkStatus.refetch),
  ]),
  () => ({ size }),
);
