import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';
import { CardTitle, FormGroup } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  UserSelectInput,
} from '../../components';

const NotifySubcard = ({ onChange, ...props }) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Notify Changes
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          <Field name="notify" subscription={{ value: true }}>
            {({ input: { value = [] } }) => value.length || ''}
          </Field>
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <FormGroup>
          <UserSelectInput
            {...{ onChange, ...props }}
            multi
            name="notify"
            placeholder="User to notify"
          />
        </FormGroup>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

NotifySubcard.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default NotifySubcard;
