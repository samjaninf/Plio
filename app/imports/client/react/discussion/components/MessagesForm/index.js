import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, InputGroup } from 'reactstrap';

import { Button, Icon, InputGroupButton } from '../../../components';
import Mention from '../../../components/Mention';

const MessagesForm = ({
  value, setValue, users, onSubmit, disabled, children,
}) => (
  <div className="chat-form" {...{ onSubmit }}>
    <form className="f1">
      <fieldset {...{ disabled }}>
        <FormGroup>
          <InputGroup>
            {children}

            <Mention direction="up" {...{ value, setValue, users }}>
              <Mention.Input
                placeholder="Add a comment"
                name="message"
                autoComplete="off"
              />
              <Mention.Menu />
            </Mention>

            <InputGroupButton addonType="append">
              <Button type="submit" color="secondary" component="button">
                <Icon name="angle-right" />
              </Button>
            </InputGroupButton>
          </InputGroup>
        </FormGroup>
      </fieldset>
    </form>
  </div>
);

MessagesForm.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default MessagesForm;
