import React from 'react';
import PropTypes from 'prop-types';

import { LessonsSubcard, EntityLessonFormContainer } from '../../lessons';

const CanvasLessonsSubcard = ({
  organizationId,
  lessons,
  linkedTo,
  documentType,
  refetchQuery,
}) => (
  <EntityLessonFormContainer
    {...{
      organizationId,
      documentType,
      lessons,
      linkedTo,
      refetchQuery,
    }}
    documentId={linkedTo._id}
    onDelete={console.log}
    render={({ onSubmit, ...restLessonProps }) => (
      <LessonsSubcard {...restLessonProps} onSave={onSubmit} />
    )}
  />
);

CanvasLessonsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  lessons: PropTypes.array.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default CanvasLessonsSubcard;
