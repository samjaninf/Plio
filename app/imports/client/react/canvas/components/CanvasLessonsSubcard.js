import React from 'react';
import PropTypes from 'prop-types';

import { LessonsSubcard, EntityLessonFormContainer } from '../../lessons';

const CanvasLessonsSubcard = ({
  organizationId,
  lessons,
  linkedTo,
  documentType,
}) => (
  <EntityLessonFormContainer
    {...{ organizationId, documentType }}
    documentId={linkedTo._id}
  >
    {({ onSubmit, initialValues }) => (
      <LessonsSubcard
        {...{
          organizationId,
          lessons,
          linkedTo,
          initialValues,
        }}
        onSave={onSubmit}
        onDelete={console.log}
      />
    )}
  </EntityLessonFormContainer>
);

CanvasLessonsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  lessons: PropTypes.array.isRequired,
  documentType: PropTypes.string.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default CanvasLessonsSubcard;
