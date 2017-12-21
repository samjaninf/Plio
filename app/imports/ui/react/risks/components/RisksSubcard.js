import React, { PropTypes } from 'react';
import { Card } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';

import CardBlockCollapse from '../../components/CardBlockCollapse';
import Subcard from '../../components/Subcard';
import CreateRiskSubcard from './CreateRiskSubcard';

const RisksSubcard = ({
  risks = [],
  users = [],
  types = [],
  userId,
  guidelines,
  isSaving,
  isNew,
  onSave,
  onDelete,
  onClose,
}) => (
  <CardBlockCollapse
    leftText="Risks"
    rightText={risks.length}
    loading={isSaving}
  >
    <Subcard.AddNewDocument
      renderBtnContent={() => 'Add a new risk'}
      render={card => (
        <CreateRiskSubcard
          key={card.id}
          id={card.id}
          onDelete={card.onDelete}
          {...{
            userId,
            users,
            types,
            isNew,
            isSaving,
            onSave,
            guidelines,
          }}
        />
      )}
    >
      {!!risks.length && (
        <Card>
          {risks.map(risk => (
            <Subcard
              key={risk._id}
              renderLeftContent={() => (
                <span>
                  <strong>{risk.sequentialId}</strong>
                  {' '}
                  {risk.title}
                </span>
              )}
            >
              <Blaze template="Risk_Subcard" {...{ risk }} />
              <Subcard.Footer
                isNew={false}
                {...{
                  isSaving,
                  onSave,
                  onDelete,
                  onClose,
                  risk,
                }}
              />
            </Subcard>
          ))}
        </Card>
      )}
    </Subcard.AddNewDocument>
  </CardBlockCollapse>
);

RisksSubcard.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  guidelines: PropTypes.object,
};

export default RisksSubcard;
