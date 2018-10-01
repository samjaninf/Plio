import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styled, { css } from 'styled-components';
import {
  compose,
  withHandlers,
  branch,
  withStateHandlers,
  withProps,
} from 'recompose';
import { Button } from 'reactstrap';
import { identity, prop } from 'ramda';
import 'react-select/dist/react-select.css';

import { omitProps } from '../../helpers';
import Icon from '../../components/Icons/Icon';
import Chip from '../../components/Chip';

export const SelectWrapper = styled.div`
  .Select {
    &.is-focused:not(.is-open) > .Select-control {
      border-color: #ccc;
      box-shadow: none;
    }
    &.is-open > .Select-control {
      border-color: #66afe9;
      box-shadow: none;
    }
    .Select-arrow-zone {
      width: 35px;
      background-image: linear-gradient(to bottom, white 0%, #e6e6e6 100%);
      border-radius: 0 4px 4px 0;
      border-left: 1px solid #e6e6e6;
      padding-left: 5px;
      &:hover > .Select-arrow {
        border-top-color: #000;
      }
    }
    .Select-arrow {
      border-color: #000 transparent transparent;
      border-width: 6px 6px 2.5px;
    }
    &.is-open > .Select-control .Select-arrow {
      border-color: transparent transparent #000;
      border-width: 2.5px 6px 6px;
    }
  }
  .Select-loading-zone {
    position: absolute;
    top: 6px;
    left: 10px;
  }
  .Select-option,
  .Select-create-option-placeholder {
    &.is-selected {
      background-color: #0275d8;
      color: #fff;
    }
    &:not(.is-selected):hover {
      background-color: #f8f9fa;
    }
  }
  .Select-menu-outer {
    max-height: 494px;
    border: none;
    z-index: 9999;
    & > .Select-menu {
      max-height: inherit;
      border: 1px solid #ccc;
      border-bottom-width: 2px;
    }
  }
  .Select--multi {
    .Select-control {
      background-color: transparent;
      border-radius: 0;
      border: none;
      overflow: visible;
      display: block;
      height: auto;
    }
    .Select-multi-value-wrapper {
      width: calc(100% - 35px);
      .btn-group {
        margin-right: 7px;
      }
      .btn.disabled {
        padding-right: 14px !important;
      }
    }
    .Select-input {
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      border: 1px solid #ccc;
      border-right: none;
      height: 36px;
      width: 100%;
      margin-left: 0;
      padding: 0 10px;
      ${({ multiPlaceholder }) => multiPlaceholder ? css`
        &:before {
          content: '${multiPlaceholder}';
          position: absolute;
          line-height: 34px;
          color: #aaa;
        }
      ` : ''}
    }
    .Select-arrow-zone {
      border-radius: 0 4px 4px 0;
      border: 1px solid #ccc;
      border-left: none;
      height: 36px;
      line-height: 36px;
      display: inline-block;
    }
    &.has-value .Select-input {
      margin-left: 0;
    }
    &.is-open {
      .Select-input {
        border-color: #66afe9;
        border-radius: 4px 0 0 0;
      }
      .Select-arrow-zone {
        border-color: #66afe9;
        border-radius: 0 4px 0 0;
      }
    }
    &.is-open {
      .Select-input:before {
        content: '';
      }
    }
  }
  ${({ type }) => type === 'creatable' ? css`
    .Select-menu-outer {
      max-height: none;
      .Select-menu:after {
        content: 'Start typing...';
        display: block;
        padding: 8px 10px;
        border-top: 1px solid #ccc;
        font-weight: 1000;
        color: #373a3c;
      }
    }
    .Select-create-option-placeholder {
      position: absolute;
      bottom: 0;
      width: 100%;
      font-weight: 1000;
      background-color: #fff;
      color: #373a3c;
      height: 38px;
      border-radius: 0 0 4px 4px;
      &.is-focused {
        background-color: #f8f9fa;
      }
    }
  ` : ''}
`;

const TextCreatorWrapper = styled.span`
  position: relative;
  top: -5px;
  .btn {
    margin-right: 8px;
  }
`;

const MultiValue = compose(
  withProps(({ value }) => ({
    label: value.label,
  })),
  withHandlers({
    onRemove: ({ value, onRemove, onRemoveMultiValue }) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(value);
      if (onRemoveMultiValue) onRemoveMultiValue(value);
    },
  }),
)(Chip);

const enhance = compose(
  branch(
    prop('loadOptionsOnOpen'),
    compose(
      withStateHandlers(
        ({ options = [], isLoading = false }) => ({ options, isLoading }),
        {
          startFetchingOptions: () => () => ({ isLoading: true }),
          endFetchingOptions: () => options => ({ options, isLoading: false }),
        },
      ),
      withHandlers({
        onOpen: ({
          startFetchingOptions,
          endFetchingOptions,
          onOpen,
          loadOptions,
        }) => () => {
          startFetchingOptions();

          loadOptions().then(({ options }) => {
            endFetchingOptions(options);
          }).catch(() => endFetchingOptions([]));

          if (onOpen) onOpen();
        },
      }),
      omitProps(['loadOptions', 'loadOptionsOnOpen']),
    ),
    identity,
  ),
  branch(
    prop('valueComponent'),
    identity,
    withProps(({ multi }) => ({
      valueComponent: multi && MultiValue,
    })),
  ),
  withProps(({
    multi,
    placeholder,
    valueComponent,
    onRemoveMultiValue,
  }) => ({
    placeholder: !multi ? placeholder : '',
    multiPlaceholder: multi ? placeholder : '',
    valueComponent: valueComponent && (props => valueComponent({ onRemoveMultiValue, ...props })),
  })),
  withHandlers({
    getSelectComponent: ({ type }) => () => {
      switch (type) {
        case 'creatable': {
          return Select.Creatable;
        }
        case 'async':
          return Select.Async;
        case 'simple':
        default:
          return Select;
      }
    },
    promptTextCreator: ({ promptTextCreator }) => label => (
      <TextCreatorWrapper>
        <Button type="button" color="secondary" size="sm">
          <Icon name="plus" />
        </Button>
        {promptTextCreator ? promptTextCreator(label) : label}
      </TextCreatorWrapper>
    ),
  }),
);

const SelectInput = ({
  getSelectComponent,
  type,
  className,
  multiPlaceholder,
  ...props
}) => {
  const SelectComponent = getSelectComponent();

  return (
    <SelectWrapper {...{ type, className, multiPlaceholder }}>
      <SelectComponent
        {...props}
        noResultsText="There are no available items..."
      />
    </SelectWrapper>
  );
};

SelectInput.defaultProps = {
  clearable: false,
  backspaceRemoves: false,
};

SelectInput.propTypes = {
  getSelectComponent: PropTypes.func,
  clearable: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
  multiPlaceholder: PropTypes.string,
};

export default enhance(SelectInput);
