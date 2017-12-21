import React, { PropTypes } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { propOr, either, view } from 'ramda';

import Subcard from '../../components/Subcard';
import Label from '../../components/Labels/Label';
import AddNewRiskSubcard from './AddNewRiskSubcard';
import { lenses } from '../../../../client/util';

const enhance = compose(
  withState('title', 'setTitle', propOr('', 'title')),
  withState('description', 'setDescription', propOr('', 'description')),
  // default to current user id if no originatorId is passed
  withState(
    'originatorId',
    'setOriginatorId',
    either(
      view(lenses.originatorId),
      view(lenses.userId),
    ),
  ),
  withState(
    'ownerId',
    'setOwnerId',
    either(
      view(lenses.ownerId),
      view(lenses.userId),
    ),
  ),
  withState('magnitude', 'setMagnitude', propOr('', 'magnitude')),
  withHandlers({
    onChangeTitle: ({ setTitle }) => e => setTitle(e.target.value),
    onChangeDescription: ({ setDescription }) => e => setDescription(e.target.value),
    onChangeOriginatorId: ({ setOriginatorId }) => (_, { value }, cb) =>
      setOriginatorId(value, cb),
    onChangeOwnerId: ({ setOwnerId }) => (_, { value }, cb) =>
      setOwnerId(value, cb),
    onChangeMagnitude: ({ setMagnitude }) => e => setMagnitude(e.target.value),
  }),
);

const CreateRiskSubcard = enhance(({
  users,
  id,
  isNew,
  isSaving,
  title,
  description,
  originatorId,
  ownerId,
  magnitude,
  onChangeTitle,
  onChangeDescription,
  onChangeOriginatorId,
  onChangeOwnerId,
  onChangeMagnitude,
  onSave,
  onDelete,
}) => (
  <Subcard
    isNew
    disabled
    renderLeftContent={() => [
      'New risk',
      isNew ? <Label names="primary"> New</Label> : null,
    ]}
  >
    <Subcard.SwitchView
      buttons={[
        <span>New</span>,
        <span>Existing</span>,
      ]}
    >
      <AddNewRiskSubcard
        {...{
          users,
          title,
          description,
          originatorId,
          ownerId,
          magnitude,
          onChangeTitle,
          onChangeDescription,
          onChangeOriginatorId,
          onChangeOwnerId,
          onChangeMagnitude,
        }}
      />
      <span>World Hello</span>
    </Subcard.SwitchView>
    <Subcard.Footer
      isNew
      {...{
        onSave,
        onDelete,
        isSaving,
        id,
        title,
        description,
        originatorId,
        ownerId,
        magnitude,
      }}
    />
  </Subcard>
));

CreateRiskSubcard.propTypes = {
  id: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CreateRiskSubcard;
