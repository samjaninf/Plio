import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';

import { renderComponent } from '../../helpers';
import Subcard from '../Subcard';
import SubcardHeader from '../SubcardHeader';
import SubcardBody from '../SubcardBody';
import CardBlock from '../CardBlock';
import ErrorSection from '../ErrorSection';
import Pull from '../Utility/Pull';
import EntityDeleteButton from './EntityDeleteButton';
import EntitySaveButton from './EntitySaveButton';

const EntityCard = ({
  label,
  renderLeftButton: LeftButton = EntityDeleteButton,
  renderRightButton: RightButton = EntitySaveButton,
  isOpen,
  toggle,
  onDelete,
  ...props
}) => (
  <Subcard {...{ ...props, isOpen, toggle }}>
    <SubcardHeader>
      {label}
    </SubcardHeader>
    <SubcardBody>
      <FormSpy subscription={{ submitError: true, error: true }}>
        {({ submitError, error }) => (
          <ErrorSection errorText={submitError || error} />
        )}
      </FormSpy>
      {renderComponent(props)}
      <CardBlock>
        <Pull left>
          <LeftButton onClick={onDelete} />
        </Pull>
        <Pull right>
          {toggle ? (
            <RightButton onClick={toggle}>Close</RightButton>
          ) : (
            <RightButton />
          )}
        </Pull>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

EntityCard.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  renderLeftButton: PropTypes.func,
  renderRightButton: PropTypes.func,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onDelete: PropTypes.func,
};

export default EntityCard;
