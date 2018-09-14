import React from 'react';
import styled from 'styled-components';
import { CardTitle, Col, CardText, ListGroup, ListGroupItem } from 'reactstrap';

import { Styles } from '../../../../api/constants';
import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  SubcardSubtitle,
  CardBlock,
  Icon,
} from '../../components';

const StyledCol = styled(Col)`
  padding: 0 1.85rem;
  .list-group-item {
    padding: .75rem 1.25rem !important;
    color: ${Styles.color.brandPrimary};
    &:hover {
      color: ${Styles.color.brandPrimary};
    }
    & > i {
      float: right;
      font-size: 1.3rem;
      margin-top: 3px;
    }
  }
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
          <ListGroup>
            <ListGroupItem tag="a">
              Add a <strong>Key goal</strong>
              <Icon name="question-circle" />
            </ListGroupItem>
            <ListGroupItem tag="a">
              Add a <strong>Standard</strong>
              <Icon name="question-circle" />
            </ListGroupItem>
            <ListGroupItem tag="a">
              Add a <strong>Risk</strong>
              <Icon name="question-circle" />
            </ListGroupItem>
            <ListGroupItem tag="a">
              Add a <strong>Nonconformity</strong>
              <Icon name="question-circle" />
            </ListGroupItem>
            <ListGroupItem tag="a">
              Add a <strong>Potential gain</strong>
              <Icon name="question-circle" />
            </ListGroupItem>
            <ListGroupItem tag="a">
              Add a <strong>Lesson learned</strong>
              <Icon name="question-circle" />
            </ListGroupItem>
          </ListGroup>
        </StyledCol>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

export default ActivelyManageSubcard;
