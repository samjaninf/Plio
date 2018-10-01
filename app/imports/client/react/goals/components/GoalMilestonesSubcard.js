import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { pick } from 'ramda';

import { MilestonesSubcard, MilestoneSubcardContainer, MilestoneForm } from '../../milestones';

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
        render={({ form: { reset } }) => (
          <MilestoneSubcardContainer
            milestone={entity}
            {...{
              isOpen,
              toggle,
              onDelete,
              linkedTo,
              color,
              reset,
            }}
          />
        )}
      />
    )}
    renderNewEntity={() => (
      <MilestoneForm {...{ linkedTo }} />
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
