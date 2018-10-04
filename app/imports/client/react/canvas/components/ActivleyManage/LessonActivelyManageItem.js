import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { LessonForm, LessonAddContainer } from '../../../lessons';
import ActivelyManageItem from './ActivelyManageItem';

const LessonActivelyManageItem = ({ organizationId, linkedTo, ...rest }) => (
  <EntityManagerItem
    {...{ organizationId, ...rest }}
    itemId="lessonLearned"
    label="Lesson learned"
    documentId={linkedTo._id}
    component={LessonAddContainer}
    render={ActivelyManageItem}
  >
    <LessonForm {...{ organizationId, linkedTo }} />
  </EntityManagerItem>
);

LessonActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default LessonActivelyManageItem;
