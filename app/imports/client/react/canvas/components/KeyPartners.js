import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import KeyPartnerAddModal from './KeyPartnerAddModal';
import KeyPartnerEditModal from './KeyPartnerEditModal';
import KeyPartnersChartModal from './KeyPartnersChartModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

const goals = [
  { sequentialId: 'KG1', title: 'Finish UI design' },
  { sequentialId: 'KG3', title: 'Close New York Office' },
  { sequentialId: 'KG4', title: 'Launch Product X' },
];

const standards = [
  { issueNumber: '2.1', title: 'Identification of needs' },
  { issueNumber: '2.2.1.1', title: 'Due diligence' },
];

const KeyPartners = ({ organizationId }) => (
  <Query
    query={Queries.KEY_PARTNERS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { keyPartners: { keyPartners = [] } } }) => (
      <CanvasBlock
        {...{ standards, goals, organizationId }}
        label="Key partners"
        sectionName={CanvasSections[CanvasTypes.KEY_PARTNER]}
        help={(
          <Fragment>
            <p>Who are our key partners/suppliers?</p>
            <p>Which key resources do they provide?</p>
          </Fragment>
        )}
        items={keyPartners}
        renderModal={({ isOpen, toggle }) => (
          <KeyPartnerAddModal {...{ isOpen, toggle, organizationId }} />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <KeyPartnerEditModal
            {...{
              isOpen,
              toggle,
              organizationId,
              _id,
            }}
          />
        )}
        renderChartModal={({ isOpen, toggle }) => (
          <KeyPartnersChartModal {...{ isOpen, toggle, organizationId }} />
        )}
        chartButtonIcon="th-large"
      />
    )}
  </Query>
);

KeyPartners.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyPartners);
