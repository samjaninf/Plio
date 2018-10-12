import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'reactstrap';
import { pure } from 'recompose';
import styled from 'styled-components';

import { getFormattedDate } from '../../../../share/helpers';
import { EntityForm, EntityCard } from '../../components';
import { validateMilestone } from '../../../validation';
import MilestoneSymbol from './MilestoneSymbol';
import MilestoneForm from './MilestoneForm';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  & > div:nth-child(2) {
    display: flex;
    align-items: center;
    & > div:nth-child(1) {
      margin-right: 10px;
    }
  }
`;

const MilestoneSubcard = ({
  milestone,
  isOpen,
  toggle,
  onDelete,
}) => (
  <Card>
    <EntityForm
      {...{ isOpen, toggle, onDelete }}
      label={(
        <StyledHeader>
          <div>{milestone.title}</div>
          <div className="hidden-xs-down">
            <div>
              {getFormattedDate(milestone.completionTargetDate)}
            </div>
            <MilestoneSymbol status={milestone.status} />
          </div>
        </StyledHeader>
      )}
      validate={validateMilestone}
      onSubmit={console.log}
      initialValues={{}}
      component={EntityCard}
    >
      {({ handleSubmit }) => (
        <MilestoneForm save={handleSubmit} />
      )}
    </EntityForm>
  </Card>
);

MilestoneSubcard.propTypes = {
  milestone: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default pure(MilestoneSubcard);
