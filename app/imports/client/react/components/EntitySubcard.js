import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { Button } from 'reactstrap';
import { FormSpy } from 'react-final-form';

import Subcard from './Subcard';
import SubcardHeader from './SubcardHeader';
import SubcardBody from './SubcardBody';
import CardBlock from './CardBlock';
import { Pull } from './Utility';
import ErrorSection from './ErrorSection';
import { SaveButton } from './Buttons';

const EntitySubcard = ({
  isOpen,
  toggle,
  entity,
  header,
  children,
  onClose = () => toggle({ entity }),
  onDelete,
  loading,
  error,
}) => (
  <Subcard
    toggle={() => toggle({ entity })}
    {...{ isOpen }}
  >
    {/* id is needed for scrolling */}
    <SubcardHeader id={`subcard-${entity._id}`}>
      {header({ entity })}
    </SubcardHeader>
    <SubcardBody>
      <FormSpy subscription={{ submitError: true, error: true }}>
        {formState => (
          <ErrorSection errorText={formState.submitError || formState.error || error} />
        )}
      </FormSpy>
      {children}
      <CardBlock>
        {onClose && (
          <Pull right>
            <SaveButton
              color="secondary"
              isSaving={loading}
              onClick={e => !loading && onClose(e, { entity, isOpen, toggle })}
            >
              Close
            </SaveButton>
          </Pull>
        )}
        {onDelete && (
          <Pull left>
            <Button
              className={cx({ disabled: loading })}
              onClick={e => !loading && onDelete(e, { entity, isOpen, toggle })}
            >
              Delete
            </Button>
          </Pull>
        )}
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

EntitySubcard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  entity: PropTypes.object.isRequired,
  header: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default EntitySubcard;
