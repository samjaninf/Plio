import { connect } from 'react-redux';
import { compose, withHandlers, mapProps } from 'recompose';

import { flattenMapStandards } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import {
  onSectionToggleCollapse,
  onTypeToggleCollapse,
  onSearchTextChange,
  onClear,
} from './handlers';

const mapStateToProps = ({
  standards: {
    sections,
    types,
    sectionsFiltered,
    typesFiltered,
    standardId,
  },
  global: { searchText, filter, collapsed, animating },
  organizations: { orgSerialNumber },
}) => ({
  sections,
  types,
  sectionsFiltered,
  searchText,
  orgSerialNumber,
  filter,
  collapsed,
  standardId,
  typesFiltered,
  animating,
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onSectionToggleCollapse,
    onTypeToggleCollapse,
    onClear,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps(props => ({
    ...props,
    shouldCollapseOnMount: true,
    sections: props.searchText ? props.sectionsFiltered : props.sections,
    types: props.searchText ? props.typesFiltered : props.types,
    searchResultsText: props.searchText
      ? `${flattenMapStandards(props.sectionsFiltered).length} matching results`
      : '',
  }))
)(StandardsLHS);
