import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';
import { FormSpy } from 'react-final-form';

import { ModalBody } from '../Modal';
import GuidancePanel from '../GuidancePanel';
import { TextAlign } from '../Utility';
import CardBlock from '../CardBlock';
import ErrorSection from '../ErrorSection';
import { handleGQError } from '../../../../api/handleGQError';
import { Consumer } from './EntityModal';

const EntityModalBody = ({ children, ...props }) => (
  <Consumer>
    {({
      state: { isGuidanceOpen },
      toggleGuidance,
      error,
      onDelete,
      guidance,
    }) => (
      <ModalBody {...props}>
        <FormSpy subscription={{ submitError: true, error: true }}>
          {formState => (
            <ErrorSection
              errorText={handleGQError(formState.submitError || formState.error || error)}
            />
          )}
        </FormSpy>
        {guidance && (
          <GuidancePanel isOpen={isGuidanceOpen} toggle={toggleGuidance}>
            {guidance}
          </GuidancePanel>
        )}
        {children}
        {onDelete && (
          <TextAlign center>
            <CardBlock>
              <Button onClick={onDelete}>
                Delete
              </Button>
            </CardBlock>
          </TextAlign>
        )}
      </ModalBody>
    )}
  </Consumer>
);

EntityModalBody.propTypes = {
  children: PropTypes.node,
};

export default EntityModalBody;
