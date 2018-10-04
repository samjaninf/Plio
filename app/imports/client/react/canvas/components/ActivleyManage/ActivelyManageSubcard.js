import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CardTitle, Col, CardText, ListGroup, FormText } from 'reactstrap';

import { Styles } from '../../../../../api/constants';
import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  SubcardSubtitle,
  CardBlock,
  EntityManager,
  EntityManagerItem,
} from '../../../components';
import ActivelyManageItem from './ActivelyManageItem';
import GoalActivelyManageItem from './GoalActivelyManageItem';
import StandardActivelyManageItem from './StandardActivelyManageItem';
import RiskActivelyManageItem from './RiskActivelyManageItem';
import LessonActivelyManageItem from './LessonActivelyManageItem';

const StyledCol = styled(Col)`
  padding: 0 1.85rem;
  .card & .list-group {
    border: 1px solid #ddd;
    border-radius: .25rem;
    & > .list-group-item {
      border-left: 0;
      border-right: 0;
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
      &:first-child {
        border-top: 0 !important;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
  }
`;

const ActivelyManageSubcard = ({
  entity: {
    _id: entityId,
    title,
    goals = [],
    standards = [],
    risks = [],
  },
  documentType,
  onUpdate,
  organizationId,
  refetchQuery,
}) => (
  <Subcard>
    <SubcardHeader>
      <CardTitle>
        Actively Manage
      </CardTitle>
      <SubcardSubtitle>
        <FormText color="muted" tag="span">
          Only by actively managing your canvas will you be able to translate
          your business design into better business performance.
        </FormText>
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
            <EntityManager>
              <GoalActivelyManageItem
                {...{
                  entityId,
                  organizationId,
                  goals,
                  onUpdate,
                }}
              />
              <StandardActivelyManageItem
                {...{
                  entityId,
                  organizationId,
                  standards,
                  onUpdate,
                }}
              />
              <EntityManagerItem
                component={ActivelyManageItem}
                itemId="standard"
                label="Standard"
                onSubmit={console.log}
              >
                ActivelyManageItem
              </EntityManagerItem>
              <RiskActivelyManageItem
                {...{ organizationId, risks, onUpdate }}
                linkedTo={{ _id: entityId, title }}
              />
              <EntityManagerItem
                component={ActivelyManageItem}
                itemId="nonconformity"
                label="Nonconformity"
                onSubmit={console.log}
              >
                ActivelyManageItem
              </EntityManagerItem>
              <EntityManagerItem
                component={ActivelyManageItem}
                itemId="potentialGain"
                label="Potential gain"
                onSubmit={console.log}
              >
                ActivelyManageItem
              </EntityManagerItem>
              <LessonActivelyManageItem
                {...{ organizationId, documentType, refetchQuery }}
                linkedTo={{ _id: entityId, title }}
              />
            </EntityManager>
          </ListGroup>
        </StyledCol>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

ActivelyManageSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
  entity: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    risks: PropTypes.array,
  }).isRequired,
};

export default ActivelyManageSubcard;
