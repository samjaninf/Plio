import { connect } from 'react-redux';
import { compose, shallowEqual, withHandlers, withProps } from 'recompose';
import { compose as kompose } from 'react-komposer';

import { pickDeep } from '/imports/api/helpers';
import { canChangeHelpDocs } from '/imports/api/checkers';
import {
  onClear,
  onModalOpen,
  onSearchTextChange,
  onToggleCollapse,
} from './handlers';
import { createHelpSectionsData } from '../../helpers';
import HelpDocsLHS from '../../components/HelpDocsLHS';

const onSearchTextChanged = (props, onData) => {
  const helpDocs = props.searchText
    ? props.helpDocs.filter(help => props.helpDocsFiltered.includes(help._id))
    : props.helpDocs;

  const helpSectionsData = createHelpSectionsData(props.helpSections, helpDocs);

  onData(null, {
    ...props,
    sections: helpSectionsData,
    searchResultsText: props.searchText
      ? `${helpDocs.length} matching results`
      : '',
  });
};

const HelpDocsLHSContainer = compose(
  connect(pickDeep([
    'global.searchText',
    'collections.helpDocs',
    'collections.helpSections',
    'helpDocs.helpDocsFiltered',
  ])),

  kompose(onSearchTextChanged, null, null, {
    shouldResubscribe: (props, nextProps) => !shallowEqual(props, nextProps),
  }),

  connect(pickDeep([
    'global.animating',
    'global.collapsed',
    'global.urlItemId',
    'global.userId',
  ])),

  withHandlers({
    onClear,
    onSearchTextChange,
    onToggleCollapse,
  }),

  withProps(props => (
    canChangeHelpDocs(props.userId) && {
      onModalOpen: onModalOpen(props),
    }
  ))
)(HelpDocsLHS);

export default HelpDocsLHSContainer;
