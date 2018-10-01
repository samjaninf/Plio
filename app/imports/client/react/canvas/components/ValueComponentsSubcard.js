import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Col } from 'reactstrap';
import { pure } from 'recompose';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
} from '../../components';
import ValueComponentsPie from './ValueComponentsPie';
import ValueComponentsMatcher from './ValueComponentsMatcher';
import CustomerElementsMatch from './CustomerElementsMatch';

const ValueComponentsSubcard = ({
  documentId,
  documentType,
  organizationId,
  benefits,
  features,
  matchedTo,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Value components
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {benefits.length + features.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col xs={12} sm={12}>
          <CustomerElementsMatch
            {...{
              benefits,
              features,
              organizationId,
              documentId,
              documentType,
              matchedTo,
            }}
            renderPie={ValueComponentsPie}
            renderMatcher={ValueComponentsMatcher}
          />
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

ValueComponentsSubcard.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.object).isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  matchedTo: PropTypes.shape({
    needs: PropTypes.arrayOf(PropTypes.object),
    wants: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default pure(ValueComponentsSubcard);
