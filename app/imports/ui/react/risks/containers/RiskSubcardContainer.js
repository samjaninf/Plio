import { shouldUpdate, withProps, withHandlers } from 'recompose';
import { eqProps } from 'ramda';
import connectUI from 'redux-ui';
import { connect } from 'react-redux';

import { remove } from '../../../../api/risks/methods';
import RiskSubcard from '../components/RiskSubcard';
import { swal } from '../../../utils';
import { ALERT_AUTOHIDE_TIME } from '../../../../api/constants';
import _modal_ from '../../../../startup/client/mixins/modal';
import { namedCompose } from '../../helpers';
import { getRiskIsNew } from '../../../../client/store/selectors/risks';

export default namedCompose('RiskSubcardContainer')(
  connect((state, { risk }) => ({
    isNew: getRiskIsNew(state, risk),
  })),
  connectUI(),
  shouldUpdate((props, nextProps) => !!(
    props.ui.opened !== nextProps.ui.opened ||
    props.isOpen !== nextProps.isOpen ||
    props.isNew !== nextProps.isNew ||
    (nextProps.opened === nextProps.risk._id &&
      props.ui.isSaving !== nextProps.ui.isSaving) ||
    !eqProps('risk', props, nextProps)
  )),
  withProps(({ ui: { opened }, risk: { _id } }) => ({ isOpen: opened === _id })),
  withHandlers({
    toggle: ({ updateUI, ui: { opened }, risk: { _id } }) => () =>
      updateUI('opened', opened === _id ? null : _id),
    onClose: ({ updateUI }) => () => updateUI('opened', null),
    onDelete: ({ updateUI }) => ({ risk: { _id, title } }) => {
      swal({
        title: 'Are you sure?',
        text: `The risk "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false,
      }, () => {
        updateUI('isSaving', true);

        const cb = (err) => {
          updateUI('isSaving', false);
          if (err) {
            swal.close();
            updateUI('error', err.message);
            return;
          }

          updateUI('error', null);

          swal({
            title: 'Removed!',
            text: `The risk "${title}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        };

        // TEMP
        // because edit modal is still in blaze
        _modal_.modal.callMethod(remove, { _id }, cb);
      });
    },
  }),
)(RiskSubcard);
