import { mergeDeepRight } from 'ramda';

import { OrgOwnerRoles, UserMembership } from '../../../../share/constants';

export default mergeDeepRight({
  standards: {
    standardsFiltered: [],
  },
  organizations: {
    organizationId: 7,
    orgSerialNumber: 1,
    organization: {
      _id: 7,
      serialNumber: 1,
      users: [
        {
          userId: 6,
          role: UserMembership.ORG_OWNER,
        },
      ],
    },
  },
  discussion: {
    isDiscussionOpened: false,
  },
  dataImport: {
    isModalOpened: false,
  },
  collections: {
    standards: [
      { _id: 1, sectionId: 8, typeId: 9 },
      { _id: 2, sectionId: 8, typeId: 9 },
      {
        _id: 3,
        sectionId: 8,
        typeId: 9,
        isDeleted: true,
        deletedAt: 1513074233019,
      },
      {
        _id: 4,
        sectionId: 8,
        typeId: 9,
        isDeleted: true,
        deletedAt: 1513074233018,
      },
      { _id: 5 },
    ],
    standardsByIds: {
      1: { _id: 1, sectionId: 8, typeId: 9 },
      2: { _id: 2, sectionId: 8, typeId: 9 },
      3: {
        _id: 3,
        sectionId: 8,
        typeId: 9,
        isDeleted: true,
        deletedAt: 1513074233019,
      },
      4: {
        _id: 4,
        sectionId: 8,
        typeId: 9,
        isDeleted: true,
        deletedAt: 1513074233018,
      },
      5: { _id: 5 },
    },
    users: [
      {
        _id: 6,
        roles: {
          7: OrgOwnerRoles,
        },
      },
    ],
    usersByIds: {
      6: {
        _id: 6,
        roles: {
          7: OrgOwnerRoles,
        },
      },
    },
    organizations: [
      {
        _id: 7,
        serialNumber: 1,
        users: [
          {
            userId: 6,
            role: UserMembership.ORG_OWNER,
          },
        ],
      },
    ],
    organizationsByIds: {
      7: {
        _id: 7,
        serialNumber: 1,
        users: [
          {
            userId: 6,
            role: UserMembership.ORG_OWNER,
          },
        ],
      },
    },
    standardBookSections: [
      { _id: 8 },
    ],
    standardBookSectionsByIds: {
      8: { _id: 8 },
    },
    standardTypes: [
      { _id: 9 },
    ],
    standardTypesByIds: {
      9: { _id: 9 },
    },
  },
  global: {
    filter: 1,
    searchText: '',
    isCardReady: true,
    isFullScreenMode: false,
    urlItemId: 1,
    userId: 6,
  },
});
