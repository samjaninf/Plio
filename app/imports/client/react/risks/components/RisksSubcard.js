import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { getId, getUserOptions, mapEntitiesToOptions, lenses, spreadProp, noop } from 'plio-util';
import { compose, pick, over, defaultTo } from 'ramda';

import EntityManagerSubcard from '../../components/EntityManagerSubcard';
import RiskSubcardContainer from '../containers/RiskSubcardContainer';
import NewRiskCard from './NewRiskCard';

const getInitialValues = compose(
  spreadProp('analysis'),
  pick([
    'title',
    'description',
    'statusComment',
    'magnitude',
    'owner',
    'originator',
    'type',
    'standards',
    'departments',
    'analysis',
  ]),
  over(lenses.owner, getUserOptions),
  over(lenses.originator, getUserOptions),
  over(lenses.type, getId),
  over(lenses.standards, mapEntitiesToOptions),
  over(lenses.departments, mapEntitiesToOptions),
  over(lenses.analysis, compose(
    pick([
      'targetDate',
      'executor',
      'completedBy',
      'completionComments',
      'completedAt',
    ]),
    over(lenses.executor, compose(getUserOptions, defaultTo({}))),
    over(lenses.completedBy, compose(getUserOptions, defaultTo({}))),
  )),
);

const RisksSubcard = ({
  risks,
  onDelete,
  linkedTo,
  organizationId,
  guidelines,
  user,
  ...props
}) => (
  <EntityManagerSubcard
    {...props}
    title="Risks"
    newEntityTitle="New risk"
    newEntityButtonTitle="Add a new risk"
    entities={risks}
    render={({ entity, isOpen, toggle }) => (
      <Form
        key={entity._id}
        onSubmit={noop}
        initialValues={getInitialValues(entity)}
        subscription={{}}
        render={({ form: { reset } }) => (
          <RiskSubcardContainer
            risk={entity}
            {...{
              isOpen,
              toggle,
              onDelete,
              organizationId,
              user,
              reset,
              guidelines,
            }}
          />
        )}
      />
    )}
    renderNewEntity={() => (
      <NewRiskCard
        {...{
          linkedTo,
          organizationId,
          guidelines,
          risks,
        }}
      />
    )}
  />
);

RisksSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  linkedTo: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
  guidelines: PropTypes.object,
  user: PropTypes.object,
};

export default RisksSubcard;
