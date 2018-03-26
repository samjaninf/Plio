import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { pick } from 'ramda';

import { MilestonesSubcard, MilestoneForm } from '../../milestones';
import GoalMilestoneSubcardContainer from '../containers/GoalMilestoneSubcardContainer';

const GoalMilestonesSubcard = ({
  milestones = [],
  onDelete,
  onSave,
  linkedTo,
  color,
}) => (
  <MilestonesSubcard
    render={({ entity, isOpen, toggle }) => (
      <Form
        onSubmit={() => null}
        key={entity._id}
        subscription={{}}
        initialValues={pick([
          'title',
          'description',
          'completionTargetDate',
          'completedAt',
          'completionComment',
        ], entity)}
        render={() => (
          <GoalMilestoneSubcardContainer
            milestone={entity}
            {...{
              isOpen,
              toggle,
              onDelete,
              linkedTo,
              color,
            }}
          />
        )}
      />
    )}
    renderNewEntity={props => (
      <MilestoneForm {...{ ...props, linkedTo }} />
    )}
    {...{
      milestones,
      onSave,
    }}
  />
);

GoalMilestonesSubcard.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  milestones: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkedTo: PropTypes.shape({
    title: PropTypes.string,
    sequentialId: PropTypes.string,
  }).isRequired,
  color: PropTypes.string,
};

export default GoalMilestonesSubcard;
