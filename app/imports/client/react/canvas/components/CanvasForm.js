import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';

import { StringLimits } from '../../../../share/constants';
import {
  CardBlock,
  FormField,
  InputField,
  UserSelectInput,
  ColorPickerField,
  TextareaField,
} from '../../components';

const CanvasForm = ({ organizationId, children, save }) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
        onBlur={save}
      />
    </FormField>
    <FormField>
      Originator
      <UserSelectInput
        {...{ organizationId }}
        name="originator"
        placeholder="Originator"
        onChange={save}
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField
        name="color"
        onChange={save}
      />
    </FormField>
    {children}
    <FormField>
      Notes
      <TextareaField
        name="notes"
        placeholder="Notes"
        onBlur={save}
      />
    </FormField>
  </CardBlock>
);

CanvasForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  children: PropTypes.node,
  save: PropTypes.func,
};

export default pure(CanvasForm);
