import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { compose, append, map, prop, view, find, propEq, either, sort } from 'ramda';
import { noop, getUserOptions, getEntityOptions, lenses, getId, byTitle } from 'plio-util';
import { pure } from 'recompose';
import { FORM_ERROR } from 'final-form';

import { insert as insertFile } from '../../../../api/files/methods';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateStandard } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { getNestingLevel, uploadFile } from '../helpers';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { StandardStatusTypes, DefaultStandardTypes } from '../../../../share/constants';

const addStandard = (goalId, goals) => compose(
  append(goalId),
  map(prop('_id')),
)(goals);

const getDefaultType = either(
  compose(
    getId,
    find(propEq(
      'title',
      DefaultStandardTypes.STANDARD_OPERATING_PROCEDURE.title,
    )),
  ),
  view(lenses.head._id),
);

const getDefaultSection = compose(
  getEntityOptions,
  view(lenses.head),
  sort(byTitle),
);

const StandardAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  entityId,
  standards,
  onUpdate,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Query
        query={Queries.STANDARD_TYPE_LIST}
        variables={{ organizationId }}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Query
        query={Queries.STANDARD_SECTION_LIST}
        variables={{ organizationId }}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_STANDARD}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([
      { data: { user } },
      {
        data: {
          standardTypes: { standardTypes = [] } = {},
        },
      },
      {
        data: {
          standardSections: { standardSections = [] } = {},
        },
      },
      createStandard,
    ]) => renderComponent({
      ...props,
      organizationId,
      standards,
      isOpen,
      toggle,
      initialValues: {
        active: 0,
        title: '',
        source1: undefined,
        section: getDefaultSection(standardSections),
        status: StandardStatusTypes.ISSUED,
        owner: getUserOptions(user),
        typeId: getDefaultType(standardTypes),
      },
      onSubmit: async (values) => {
        const {
          active,
          title,
          status,
          source1: { file, ...source1 } = {},
          section: { value: sectionId } = {},
          owner: { value: owner } = {},
          typeId,
        } = values;
        let linkToEntity;

        if (entityId) {
          linkToEntity = standardId => onUpdate({
            variables: {
              input: {
                _id: entityId,
                standardIds: addStandard(standardId, standards),
              },
            },
          });

          if (active === 1) {
            return linkToEntity(values.standard.value).then(toggle || noop);
          }
        }

        const errors = validateStandard(values);
        if (errors) return errors;

        const nestingLevel = getNestingLevel(title);
        if (nestingLevel > 4) {
          return { [FORM_ERROR]: 'Maximum nesting is 4 levels. Please change your title.' };
        }

        let fileId;
        if (source1.type === 'attachment' && file) {
          fileId = await insertFile.call({
            name: file.name,
            extension: file.name.split('.').pop().toLowerCase(),
            organizationId,
          });
        }

        return createStandard({
          variables: {
            input: {
              title,
              status,
              sectionId,
              typeId,
              owner,
              nestingLevel,
              organizationId,
              source1: {
                fileId,
                ...source1,
              },
            },
          },
        }).then(({ data: { createStandard: { standard } } }) => {
          if (fileId) {
            uploadFile({
              file,
              fileId,
              organizationId,
              standardId: standard._id,
            });
          }
          if (linkToEntity) linkToEntity(standard._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

StandardAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onUpdate: PropTypes.func,
  standards: PropTypes.array,
  entityId: PropTypes.string,
};

export default pure(StandardAddContainer);
