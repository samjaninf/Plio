import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { NotifySubcard } from '../../components';
import MilestoneForm from './MilestoneForm';

const MilestoneEdit = ({ _id: milestoneId, organizationId, save }) => (
  <Fragment>
    <MilestoneForm {...{ save }} />

    <NotifySubcard
      {...{ organizationId }}
      onChange={save}
      documentId={milestoneId}
    />
  </Fragment>
);

MilestoneEdit.propTypes = {
  _id: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default MilestoneEdit;
