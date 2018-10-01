import React, { Fragment } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { find, propEq } from 'ramda';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
} from 'reactstrap';

import ModalMixin from '../../../../startup/client/mixins/modal';
import { setSelectedOrgSerialNumber } from '../../../../api/helpers';
import { APP_VERSION, RouteNames } from '../../../../api/constants';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { OrgCurrencies, UserRoles } from '../../../../share/constants';
import { Query as Queries } from '../../../graphql';
import { FlowRouterContext, RenderSwitch, Preloader } from '../../components';
import { WithToggle } from '../../helpers';
import HeaderMenuItem from './HeaderMenuItem';

const RouteLabels = {
  [RouteNames.CANVAS]: 'Business design view',
  [RouteNames.DASHBOARD]: 'Business operations view',
};

const DropdownMenuStyled = styled(DropdownMenu)`
  min-width: 330px;
`;

const PreloaderStyled = styled(Preloader)`
  display: block;
  width: 20px;
  margin: auto;
  padding: 10px 0;
`;

const OrganizationMenu = ({ organization: currentOrg, isDashboard }) => (
  <FlowRouterContext getParam="orgSerialNumber" getRouteName>
    {({ orgSerialNumber, routeName, router }) => (
      <Nav navbar className="nav pull-xs-left">
        <WithToggle>
          {({ isOpen, toggle }) => (
            <Dropdown {...{ isOpen, toggle }}>
              <DropdownToggle nav caret>
                {currentOrg.name}
                <span className="secondary-label"> {RouteLabels[routeName]}</span>
              </DropdownToggle>

              <DropdownMenuStyled>
                <Query
                  query={Queries.ORGANIZATIONS_MENU}
                  variables={{ organizationId: currentOrg._id }}
                  skip={!isOpen}
                >
                  {({
                    error, loading, refetch,
                    data: {
                      organizations: { organizations = [] } = {},
                      me: {
                        roles = [],
                        profile = {},
                        _id: userId,
                        isPlioUser,
                      } = {},
                    },
                  }) => (
                    <RenderSwitch
                      {...{ error, loading }}
                      renderLoading={<PreloaderStyled />}
                    >
                      <Fragment>
                        {organizations.map(({ _id, name, serialNumber }) => (
                          <HeaderMenuItem
                            key={_id}
                            // TODO delete line below when dashboard page will be on React
                            toggle={!isDashboard}
                            onClick={() => {
                              setSelectedOrgSerialNumber(serialNumber, userId);
                              router.setParams({ orgSerialNumber: serialNumber });
                            }}
                            active={currentOrg._id === _id}
                          >
                            {name}
                          </HeaderMenuItem>
                        ))}

                        <DropdownItem divider />
                        <HeaderMenuItem
                          tag="a"
                          href={router.path(RouteNames.CANVAS, { orgSerialNumber })}
                          active={routeName === RouteNames.CANVAS}
                        >
                          {RouteLabels[RouteNames.CANVAS]}
                        </HeaderMenuItem>
                        <HeaderMenuItem
                          tag="a"
                          href={router.path(RouteNames.DASHBOARD, { orgSerialNumber })}
                          active={routeName === RouteNames.DASHBOARD}
                        >
                          {RouteLabels[RouteNames.DASHBOARD]}
                        </HeaderMenuItem>

                        <DropdownItem divider />
                        {roles.includes(UserRoles.CHANGE_ORG_SETTINGS) && (
                          <HeaderMenuItem
                            onClick={async () => {
                              // eslint-disable-next-line max-len
                              await import('../../../../ui/components/dashboard/includes/organization-menu/settings');

                              ModalMixin.modal.open({
                                template: 'OrgSettings',
                                _title: 'Organization settings',
                                helpText: OrganizationSettingsHelp.organizationSettings,
                                organizationId: currentOrg._id,
                                onDeleteOrg: () => {
                                  refetch();
                                  router.go(RouteNames.HELLO);
                                },
                              });
                            }}
                          >
                            Org Settings
                          </HeaderMenuItem>
                        )}

                        <HeaderMenuItem
                          onClick={async () => {
                            // eslint-disable-next-line max-len
                            await import('../../../../ui/components/dashboard/includes/organization-menu/settings');

                            ModalMixin.modal.open({
                              template: 'Organizations_Create',
                              _title: 'New organization',
                              variation: 'save',
                              timezone: moment.tz.guess(),
                              ownerName: profile.fullName,
                              currency: OrgCurrencies.GBP,
                              onCreateOrg: organizationId => refetch().then(({
                                data: {
                                  organizations: { organizations: newOrganizations = [] } = {},
                                },
                              }) => {
                                const findOrganization = find(propEq('_id', organizationId));
                                const { serialNumber } = findOrganization(newOrganizations);
                                router.setParams({ orgSerialNumber: serialNumber });
                              }),
                            });
                          }}
                        >
                          Create new Plio organization
                        </HeaderMenuItem>

                        {isPlioUser && (
                          <Fragment>
                            <DropdownItem divider />
                            <HeaderMenuItem
                              tag="a"
                              href={router.path(RouteNames.CUSTOMERS)}
                            >
                              Plio organizations
                            </HeaderMenuItem>
                          </Fragment>
                        )}

                        <DropdownItem divider />
                        <HeaderMenuItem disabled>
                          Plio version {APP_VERSION}
                        </HeaderMenuItem>
                      </Fragment>
                    </RenderSwitch>
                  )}
                </Query>
              </DropdownMenuStyled>
            </Dropdown>
          )}
        </WithToggle>
      </Nav>
    )}
  </FlowRouterContext>
);

OrganizationMenu.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  isDashboard: PropTypes.bool,
};

export default OrganizationMenu;
