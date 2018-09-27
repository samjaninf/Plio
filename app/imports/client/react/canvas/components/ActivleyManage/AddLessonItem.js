import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { LessonForm, EntityLessonFormContainer } from '../../../lessons';
import ActivelyManageItem from './ActivelyManageItem';

const AddLessonItem = ({
  organizationId,
  linkedTo,
  documentType,
  refetchQuery,
}) => (
  <EntityLessonFormContainer
    {...{ organizationId, documentType, refetchQuery }}
    documentId={linkedTo._id}
  >
    {props => (
      <EntityManagerItem
        component={ActivelyManageItem}
        itemId="lessonLearned"
        label="Lesson learned"
        {...props}
      >
        <LessonForm {...{ organizationId, linkedTo }} />
      </EntityManagerItem>
    )}
  </EntityLessonFormContainer>
);

AddLessonItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddLessonItem;
