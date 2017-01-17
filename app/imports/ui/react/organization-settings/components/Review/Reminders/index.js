import React, { PropTypes } from 'react';

import ReviewReminder from '../Reminder';

const ReviewReminders = ({ fieldName }) => (
  <div>
    <div className="form-group form-group-inline">
      <label className="form-control-label">Start reminding</label>
      <ReviewReminder
        type="start"
        fieldName={fieldName}
      />
      <label className="form-control-label">before due</label>
    </div>

    <div className="form-group form-group-inline">
      <label className="form-control-label">Then every</label>
      <ReviewReminder
        type="interval"
        fieldName={fieldName}
      />

      <label className="form-control-label">until</label>
      <ReviewReminder
        type="until"
        fieldName={fieldName}
      />
      <label className="form-control-label">past due</label>
    </div>
  </div>
);

ReviewReminders.propTypes = {
  fieldName: PropTypes.string,
};

export default ReviewReminders;
