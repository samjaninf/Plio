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
import AddRiskItem from './AddRiskItem';
import AddLessonItem from './AddLessonItem';
import ActivelyManageItem from './ActivelyManageItem';

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
    _id,
    title,
    risks = [],
  },
  documentType,
  onUpdate,
  ...rest
}) => {
  const itemProps = {
    ...rest,
    linkedTo: { _id, title },
  };
  return (
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
                <EntityManagerItem
                  component={ActivelyManageItem}
                  itemId="keyGoal"
                  label="Key goal"
                  onSubmit={console.log}
                >
                  ActivelyManageItem
                </EntityManagerItem>
                <EntityManagerItem
                  component={ActivelyManageItem}
                  itemId="standard"
                  label="Standard"
                  onSubmit={console.log}
                >
                  ActivelyManageItem
                </EntityManagerItem>
                <AddRiskItem {...{ risks, onUpdate, ...itemProps }} />
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
                <AddLessonItem {...{ documentType, ...itemProps }} />
              </EntityManager>
            </ListGroup>
          </StyledCol>
        </CardBlock>
      </SubcardBody>
    </Subcard>
  );
};

ActivelyManageSubcard.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  documentType: PropTypes.string.isRequired,
  entity: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    risks: PropTypes.array,
  }).isRequired,
};

export default ActivelyManageSubcard;
