import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { noop, mapEntitiesToOptions, byTitle } from 'plio-util';
import { compose, sort } from 'ramda';

import swal from '../../../../ui/utils/swal';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { Composer } from '../../helpers';
import { SelectInputField } from '../../components';

const getOptions = compose(
  mapEntitiesToOptions,
  sort(byTitle),
);

const StandardsSectionField = ({ organizationId, ...props }) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.STANDARD_SECTION_LIST}
        variables={{ organizationId }}
        children={noop}
      />,
      <Mutation mutation={Mutations.CREATE_STANDARD_SECTION} children={noop} />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([
      {
        data: { standardSections: { standardSections = [] } = {} },
      },
      createStandardSection,
    ]) => (
      <SelectInputField
        {...props}
        promptTextCreator={selectedLabel => `Add "${selectedLabel}" section`}
        placeholder="Standards section"
        type="creatable"
        options={getOptions(standardSections)}
        onNewOptionClick={({ value: title }, callback) => {
          if (!title) return;
          swal({
            title: 'Are you sure?',
            text: `New section "${title}" will be added.`,
            confirmButtonText: 'Add',
            showCancelButton: true,
            type: 'warning',
          }, () => {
            createStandardSection({
              variables: {
                input: {
                  title,
                  organizationId,
                },
              },
              refetchQueries: [
                {
                  query: Queries.STANDARD_SECTION_LIST,
                  variables: { organizationId },
                },
              ],
            }).then(({
              data: {
                createStandardSection: { standardSection = {} } = {},
              },
            }) => {
              callback({
                label: standardSection.title,
                value: standardSection._id,
              });
              swal.success('Added!', `Section "${title}" was added successfully.`);
            });
          });
        }}
      />
    )}
  </Composer>
);

StandardsSectionField.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StandardsSectionField;
