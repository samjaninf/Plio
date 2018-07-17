import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Sortable from 'react-sortablejs';
import { StyledMixins } from 'plio-util';

import { CanvasStyles } from '../constants';

const SortableList = styled(Sortable)`
  list-style: none;
  margin: 0;
  padding: 0px ${CanvasStyles.sectionPadding};
  flex: 1;
  ${StyledMixins.scroll};

  & > .sortable-chosen.sortable-ghost {
    height: 21px;
    border: 1px dashed #ddd;
    background-color: transparent;

    > * {
      display: none;
    }
  }

  li span {
    overflow: hidden;
    display: block;
  }
`;

const CanvasSectionItems = ({ children, onChange, ...props }) => (
  <SortableList
    {...props}
    onChange={(ordered, sortable, e) => onChange(e.item.dataset.id, e.newIndex, ordered)}
  >
    {children}
  </SortableList>
);

CanvasSectionItems.propTypes = {
  tag: PropTypes.string,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
};

CanvasSectionItems.defaultProps = {
  tag: 'ul',
};

export default CanvasSectionItems;