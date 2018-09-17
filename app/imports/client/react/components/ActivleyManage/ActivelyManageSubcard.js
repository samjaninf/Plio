import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CardTitle, Col, CardText, ListGroup } from 'reactstrap';
import { getUserOptions } from 'plio-util';
import { Query } from 'react-apollo';
// import { view } from 'ramda';

import { Query as Queries } from '../../../graphql';
import { Styles, ApolloFetchPolicies } from '../../../../api/constants';
import { ProblemMagnitudes } from '../../../../share/constants';
import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  SubcardSubtitle,
  CardBlock,
  EntityManager,
  EntityManagerItem,
  ActivelyManageItem,
} from '../../components';
import NewRiskCard from '../../risks/components/NewRiskCard';

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

const ActivelyManageSubcard = ({
  organizationId,
  entity: { risks, title = '' },
}) => (
  <Query
    query={Queries.CURRENT_USER_FULL_NAME}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { user } }) => (
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
                <EntityManager>
                  <EntityManagerItem
                    component={ActivelyManageItem}
                    itemId="keyGoal"
                    label="Key goal"
                  >
                    ActivelyManageItem
                  </EntityManagerItem>
                  <EntityManagerItem
                    component={ActivelyManageItem}
                    itemId="standard"
                    label="Standard"
                  >
                    ActivelyManageItem
                  </EntityManagerItem>
                  <EntityManagerItem
                    component={ActivelyManageItem}
                    itemId="risk"
                    label="Risk"
                    initialValues={{
                      active: 0,
                      magnitude: ProblemMagnitudes.MAJOR,
                      originator: getUserOptions(user),
                      owner: getUserOptions(user),
                      // type: view(lenses.head._id, riskTypes),
                    }}
                  >
                    <NewRiskCard
                      {...{ organizationId, risks }}
                      linkedTo={{ title }}
                    />
                  </EntityManagerItem>
                  <EntityManagerItem
                    component={ActivelyManageItem}
                    itemId="nonconformity"
                    label="Nonconformity"
                  >
                    ActivelyManageItem
                  </EntityManagerItem>
                  <EntityManagerItem
                    component={ActivelyManageItem}
                    itemId="potentialGain"
                    label="Potential gain"
                  >
                    ActivelyManageItem
                  </EntityManagerItem>
                  <EntityManagerItem
                    component={ActivelyManageItem}
                    itemId="lessonLearned"
                    label="Lesson learned"
                  >
                    ActivelyManageItem
                  </EntityManagerItem>
                </EntityManager>
              </ListGroup>
            </StyledCol>
          </CardBlock>
        </SubcardBody>
      </Subcard>
    )}
  </Query>
);

ActivelyManageSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  entity: PropTypes.shape({
    title: PropTypes.string,
    risks: PropTypes.array,
  }).isRequired,
};

export default ActivelyManageSubcard;
