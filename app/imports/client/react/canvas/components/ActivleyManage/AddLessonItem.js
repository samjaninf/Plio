import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { LessonForm, EntityLessonFormContainer } from '../../../lessons';
import ActivelyManageItem from './ActivelyManageItem';

const AddLessonItem = ({ organizationId, linkedTo, ...rest }) => (
  <EntityManagerItem
    {...{ organizationId, ...rest }}
    itemId="lessonLearned"
    label="Lesson learned"
    documentId={linkedTo._id}
    component={EntityLessonFormContainer}
    render={ActivelyManageItem}
  >
    <LessonForm {...{ organizationId, linkedTo }} />
  </EntityManagerItem>
);

AddLessonItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddLessonItem;
