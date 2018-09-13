import React from 'react';
import styled from 'styled-components';
import { CardTitle, Col, CardText } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  CardBlock,
  SubcardSubtitle,
} from '../../components';

const StyledCol = styled(Col)`
  padding: 0 1.85rem
`;

const ActivelyManageSubcard = () => (
  <Subcard>
    <SubcardHeader>
      <CardTitle>
        Actively Manage
      </CardTitle>
      <SubcardSubtitle className="text-muted">
        Only by actively managing your canvas will you be able to translate
        your business design into better business performance.
      </SubcardSubtitle>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <StyledCol xs={12} sm={12}>
          <CardText>
            To actively manage this section of your canvas,
            you need to do at least one of the following:
          </CardText>
        </StyledCol>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

export default ActivelyManageSubcard;
