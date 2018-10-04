import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { pick, over, compose } from 'ramda';
import { lenses, getUserOptions } from 'plio-util';

import { EntityManagerSubcard } from '../../components';
import LessonForm from './LessonForm';
import LessonSubcardContainer from '../containers/LessonSubcardContainer';

const getInitialValues = compose(
  pick(['title', 'date', 'owner', 'notes']),
  over(lenses.owner, getUserOptions),
);

const LessonsSubcard = ({
  lessons,
  onDelete,
  linkedTo,
  organizationId,
  ...props
}) => (
  <EntityManagerSubcard
    {...props}
    title="Lessons learned"
    newEntityTitle="New lesson learned"
    newEntityButtonTitle="Add a new lesson learned"
    entities={lessons}
    renderNewEntity={() => (
      <LessonForm {...{ linkedTo, organizationId }} />
    )}
    render={({ entity, isOpen, toggle }) => (
      <Form
        onSubmit={() => null}
        key={entity._id}
        initialValues={getInitialValues(entity)}
        subscription={{}}
        render={({ form: { reset } }) => (
          <LessonSubcardContainer
            lesson={entity}
            {...{
              organizationId,
              linkedTo,
              isOpen,
              toggle,
              onDelete,
              reset,
            }}
          />
        )}
      />
    )}
  />
);

LessonsSubcard.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.object),
  linkedTo: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default LessonsSubcard;
