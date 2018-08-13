import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import {
  onDiscussionOpen,
  onToggleScreenMode,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';
import { getIsFullScreenMode, getUserId } from '../../../../store/selectors/global';
import { getOrganizationId } from '../../../../store/selectors/organizations';
import { getIsDiscussionOpened } from '../../../../store/selectors/discussion';
import {
  getCanChangeStandards,
  getIsOrgOwner,
} from '../../../../store/selectors/users';

const mapStateToProps = (state, { standard: { _id, title, isDeleted = false } }) => ({
  _id,
  title,
  isDeleted,
  userId: getUserId(state),
  organizationId: getOrganizationId(state),
  hasAccess: getCanChangeStandards(state),
  hasFullAccess: getIsOrgOwner(state),
  isFullScreenMode: getIsFullScreenMode(state),
  isDiscussionOpened: getIsDiscussionOpened(state),
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onDiscussionOpen,
    onToggleScreenMode,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
