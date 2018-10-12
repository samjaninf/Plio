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
  EntityManager,
  EntityManagerItem,
  EntityManagerAddButton,
  EntityManagerForms,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerForm,
} from '../../components';

import MilestoneSubcard from './MilestoneSubcard';
import MilestoneForm from './MilestoneForm';

const MilestonesSubcard = ({
  milestones,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Milestones
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {milestones.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            {milestones.map(milestone => (
              <EntityManagerItem
                {...{ milestone }}
                key={milestone._id}
                entity={milestone}
                component={MilestoneSubcard}
                onDelete={console.log}
              />
            ))}
            <EntityManagerForms>
              <EntityManagerCards
                label="New milestone"
                component={EntityManagerForm}
                render={EntityManagerCard}
                initialValues={{}}
                onSubmit={console.log}
              >
                <MilestoneForm />
              </EntityManagerCards>
              <EntityManagerAddButton>Add a milestone</EntityManagerAddButton>
            </EntityManagerForms>
          </EntityManager>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

MilestonesSubcard.propTypes = {
  milestones: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default pure(MilestonesSubcard);
