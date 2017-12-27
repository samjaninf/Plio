import React from 'react';
import PropTypes from 'prop-types';
import { shouldUpdate } from 'recompose';
import { equals } from 'ramda';

import { Subcard, Label, SwitchView } from '../../components';
import RiskSubcardAddNewContainer from '../containers/RiskSubcardAddNewContainer';
import { namedCompose } from '../../helpers';

const enhance = namedCompose('RiskSubcardNew')(
  shouldUpdate((props, nextProps) => !!(
    props.isNew !== nextProps.isNew ||
    props.ui.activeView !== nextProps.ui.activeView ||
    props.ui.title !== nextProps.ui.title ||
    props.ui.description !== nextProps.ui.description ||
    props.ui.originatorId !== nextProps.ui.originatorId ||
    props.ui.ownerId !== nextProps.ui.ownerId ||
    props.ui.magnitude !== nextProps.ui.magnitude ||
    props.ui.typeId !== nextProps.ui.typeId ||
    props.standardId !== nextProps.standardId ||
    !equals(props.types, nextProps.types) ||
    !equals(props.card, nextProps.card)
  )),
);

const RiskSubcardNew = enhance(({
  isNew,
  card,
  ui: {
    activeView,
    title,
    description,
    originatorId,
    ownerId,
    magnitude,
    typeId,
  },
  onChangeTitle,
  onChangeDescription,
  onChangeOriginatorId,
  onChangeOwnerId,
  onChangeMagnitude,
  onChangeTypeId,
  onChangeActiveView,
  standardId,
  types,
}) => (
  <Subcard disabled>
    <Subcard.Header isNew>
      New risk
      {isNew && <Label names="primary"> New</Label>},
    </Subcard.Header>
    <Subcard.Body>
      <SwitchView
        buttons={[
          <span>New</span>,
          <span>Existing</span>,
        ]}
        onChange={onChangeActiveView}
        active={activeView}
      >
        <RiskSubcardAddNewContainer
          {...{
            title,
            description,
            originatorId,
            ownerId,
            magnitude,
            typeId,
            onChangeTitle,
            onChangeDescription,
            onChangeOriginatorId,
            onChangeOwnerId,
            onChangeMagnitude,
            onChangeTypeId,
            types,
            standardId,
          }}
        />
        <span>Hello World</span>
        {/* <AddExistingRiskSubcardContainer
          selected={riskId}
          onChange={onChangeRiskId}
          {...{ risks }}
        /> */}
      </SwitchView>
    </Subcard.Body>
  </Subcard>
));

RiskSubcardNew.propTypes = {
  isNew: PropTypes.bool,
  ui: PropTypes.shape({
    activeView: PropTypes.number,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    originatorId: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    magnitude: PropTypes.string.isRequired,
    typeId: PropTypes.string.isRequired,
  }).isRequired,
  card: PropTypes.object.isRequired,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  standardId: PropTypes.string,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeOriginatorId: PropTypes.func.isRequired,
  onChangeOwnerId: PropTypes.func.isRequired,
  onChangeMagnitude: PropTypes.func.isRequired,
  onChangeTypeId: PropTypes.func.isRequired,
  onChangeActiveView: PropTypes.func,
  // eslint-disable-next-line react/no-typos
};

export default RiskSubcardNew;
