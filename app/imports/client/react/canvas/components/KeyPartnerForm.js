import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';

import { getCriticalityValueLabel } from '../helpers';
import { FormField, SliderField } from '../../components';
import { CriticalityLabels } from '../../../../api/constants';
import CanvasForm from './CanvasForm';

const sliderLabels = {
  leftLabel: CriticalityLabels.LOW,
  rightLabel: CriticalityLabels.HIGH,
};

const KeyPartnerForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Criticality
      <SliderField
        {...sliderLabels}
        name="criticality"
        onAfterChange={save}
        tipFormatter={getCriticalityValueLabel}
      />
    </FormField>
    <FormField>
      Level of spend
      <SliderField
        {...sliderLabels}
        name="levelOfSpend"
        onAfterChange={save}
        tipFormatter={getCriticalityValueLabel}
      />
    </FormField>
  </CanvasForm>
);

KeyPartnerForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(KeyPartnerForm);
