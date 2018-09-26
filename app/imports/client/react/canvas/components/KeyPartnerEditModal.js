import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat, path } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateKeyPartner } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';
import { WithState, Composer } from '../../helpers';
import KeyPartnerForm from './KeyPartnerForm';
import CanvasFilesSubcard from './CanvasFilesSubcard';
import CanvasRisksSubcard from './CanvasRisksSubcard';
import CanvasLessonsSubcard from './CanvasLessonsSubcard';
import ActivelyManageSubcard from './ActivleyManage/ActivelyManageSubcard';

const keyPartnerPath = repeat('keyPartner', 2);
const getKeyPartner = path(keyPartnerPath);
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'criticality',
    'levelOfSpend',
    'notes',
  ]),
  pathOr({}, keyPartnerPath),
);

const KeyPartnerEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            query={Queries.KEY_PARTNER_CARD}
            variables={{ _id }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_KEY_PARTNER} children={noop} />,
          <Mutation mutation={Mutations.DELETE_KEY_PARTNER} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateKeyPartner, deleteKeyPartner]) => {
          const keyPartner = getKeyPartner(data);
          return (
            <EntityModalNext
              {...{ isOpen, toggle }}
              isEditMode
              loading={query.loading}
              error={query.error}
              guidance="Key partner"
              onDelete={() => {
                const { title } = keyPartner || {};
                swal.promise(
                  {
                    text: `The key partner "${title}" will be deleted`,
                    confirmButtonText: 'Delete',
                    successTitle: 'Deleted!',
                    successText: `The key partner "${title}" was deleted successfully.`,
                  },
                  () => deleteKeyPartner({
                    variables: { input: { _id } },
                    refetchQueries: [
                      { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                    ],
                  }).then(toggle),
                );
              }}
            >
              <EntityModalForm
                {...{ initialValues }}
                validate={validateKeyPartner}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    criticality,
                    levelOfSpend,
                    notes = '', // final form sends undefined value instead of an empty string
                  } = values;

                  return updateKeyPartner({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        criticality,
                        levelOfSpend,
                        originatorId: originator.value,
                      },
                    },
                  }).then(noop).catch((err) => {
                    form.reset(currentValues);
                    throw err;
                  });
                }}
              >
                {({ handleSubmit }) => (
                  <Fragment>
                    <EntityModalHeader label="Key partner" />
                    <EntityModalBody>
                      <RenderSwitch
                        require={keyPartner}
                        errorWhenMissing={noop}
                        loading={query.loading}
                        renderLoading={<KeyPartnerForm {...{ organizationId }} />}
                      >
                        {({
                          risks = [],
                          lessons = [],
                          title,
                        }) => (
                          <Fragment>
                            <KeyPartnerForm {...{ organizationId }} save={handleSubmit} />
                            <ActivelyManageSubcard
                              {...{ organizationId }}
                              entity={keyPartner}
                              documentType={CanvasTypes.KEY_PARTNER}
                              onUpdate={updateKeyPartner}
                            />
                            {risks.length ? (
                              <CanvasRisksSubcard
                                {...{ organizationId, risks }}
                                linkedTo={{ _id, title }}
                                onUpdate={updateKeyPartner}
                              />
                            ) : null}
                            {lessons.length ? (
                              <CanvasLessonsSubcard
                                {...{ organizationId, lessons }}
                                linkedTo={{ _id, title }}
                                documentType={CanvasTypes.KEY_PARTNER}
                              />
                            ) : null}
                            <CanvasFilesSubcard
                              {...{ organizationId }}
                              documentId={_id}
                              onUpdate={updateKeyPartner}
                              slingshotDirective={AWSDirectives.KEY_PARTNER_FILES}
                              documentType={CanvasTypes.KEY_PARTNER}
                            />
                          </Fragment>
                        )}
                      </RenderSwitch>
                    </EntityModalBody>
                  </Fragment>
                )}
              </EntityModalForm>
            </EntityModalNext>
          );
        }}
      </Composer>
    )}
  </WithState>
);

KeyPartnerEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(KeyPartnerEditModal);
