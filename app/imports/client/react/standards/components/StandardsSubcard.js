import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerSubcard } from '../../components';
import StandardEditContainer from '../containers/StandardEditContainer';
import NewStandardCard from './NewStandardCard';
import StandardSubcard from './StandardSubcard';

const StandardsSubcard = ({
  organizationId,
  standards,
  onSubmit,
  ...props
}) => (
  <EntityManagerSubcard
    {...props}
    title="Standards"
    newEntityTitle="New standard"
    newEntityButtonTitle="Add a new standard"
    entities={standards}
    onSave={onSubmit}
    render={({ entity, isOpen, toggle }) => (
      <StandardEditContainer
        {...{
          organizationId,
          isOpen,
          toggle,
        }}
        key={entity._id}
        standard={entity}
        component={StandardSubcard}
      />
    )}
    renderNewEntity={() => <NewStandardCard {...{ organizationId, standards }} />}
  />
);

StandardsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  standards: PropTypes.array.isRequired,
};

export default StandardsSubcard;

