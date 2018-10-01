import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Col } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
} from '../../components';
import CustomerInsightsMatcher from './CustomerInsightsMatcher';
import CustomerInsightsPie from './CustomerInsightsPie';
import CustomerElementsMatch from './CustomerElementsMatch';

const CustomerInsightsSubcard = ({
  organizationId,
  documentId,
  documentType,
  needs,
  wants,
  matchedTo,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Customer insights
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {needs.length + wants.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col xs={12} sm={12}>
          <CustomerElementsMatch
            {...{
              needs,
              wants,
              organizationId,
              documentId,
              documentType,
              matchedTo,
            }}
            renderPie={CustomerInsightsPie}
            renderMatcher={CustomerInsightsMatcher}
          />
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

CustomerInsightsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  needs: PropTypes.arrayOf(PropTypes.object).isRequired,
  wants: PropTypes.arrayOf(PropTypes.object).isRequired,
  matchedTo: PropTypes.shape({
    benefits: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default CustomerInsightsSubcard;
