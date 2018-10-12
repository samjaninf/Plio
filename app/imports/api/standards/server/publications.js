import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { getJoinUserToOrganizationDate } from '../../../api/organizations/utils';
import { Standards } from '../../../share/collections/standards';
import { isOrgMember } from '../../checkers';
import { Files } from '../../../share/collections/files';
import { LessonsLearned } from '../../../share/collections/lessons';
import { NonConformities } from '../../../share/collections/non-conformities';
import { Risks } from '../../../share/collections/risks';
import { Departments } from '../../../share/collections/departments';
import { Reviews } from '../../../share/collections/reviews';
import Counter from '../../counter/server';
import { ActionTypes, DocumentTypes } from '../../../share/constants';
import { StandardsBookSections } from '../../../share/collections/standards-book-sections';
import { StandardTypes } from '../../../share/collections/standards-types';
import { RiskTypes } from '../../../share/collections/risk-types';
import {
  makeOptionsFields,
  getCursorNonDeleted,
  toObjFind,
  compose,
  mapC,
  concatC,
  toDocId,
  toDocIdAndType,
} from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getActionsWithLimitedFields } from '../../actions/utils';
import {
  getProblemsByStandardIds,
  createProblemsTree,
} from '../../problems/utils';
import { getPublishCompositeOrganizationUsers } from '../../../server/helpers/pub-helpers';
import { publishWithMiddleware } from '../../helpers/server';
import { checkOrgMembership } from '../../middleware';
import { checkLoggedIn } from '../../../share/middleware';

const getStandardFiles = ({
  improvementPlan: {
    fileIds = [],
  } = {},
  source1,
  source2,
}) => {
  const { fileId: fileId1 } = source1 || {};
  const { fileId: fileId2 } = source2 || {};
  let ids = [...fileIds];

  if (fileId1) ids = ids.concat(fileId1);
  if (fileId2) ids = ids.concat(fileId2);

  return Files.find({ _id: { $in: ids } });
};

const getStandardsLayoutPub = function (userId, serialNumber, isDeleted = false) {
  const standardsFields = {
    title: 1,
    sectionId: 1,
    typeId: 1,
    organizationId: 1,
    isDeleted: 1,
    uniqueNumber: 1,
    ...(() => _.isObject(isDeleted)
      ? null
      : { deletedAt: 1, deletedBy: 1 }
    )(),
  };

  const pubs = [
    {
      find({ _id: organizationId }) {
        return StandardsBookSections.find({ organizationId }, {
          fields: StandardsBookSections.publicFields,
        });
      },
    },
    {
      find({ _id: organizationId }) {
        return StandardTypes.find({ organizationId }, {
          fields: StandardTypes.publicFields,
        });
      },
    },
    {
      find({ _id: organizationId }) {
        return Standards.find({ organizationId, isDeleted }, {
          fields: standardsFields,
        });
      },
    },
  ];

  return pubs;
};

Meteor.publishComposite(
  'standardsLayout',
  getPublishCompositeOrganizationUsers(getStandardsLayoutPub),
);

Meteor.publishComposite('standardsList', (
  organizationId,
  isDeleted = { $in: [null, false] },
) => ({
  find() {
    const { userId } = this;

    if (!userId || !isOrgMember(userId, organizationId)) {
      return this.ready();
    }

    return Standards.find({
      organizationId,
      isDeleted,
    }, { fields: Standards.publicFields });
  },
}));

Meteor.publishComposite('standardCard', function publishStandardCard({
  _id,
  organizationId,
  isDeleted,
}) {
  check(_id, String);
  check(organizationId, String);
  check(isDeleted, Boolean);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const find = () => {
    const query = { _id, organizationId };

    if (typeof isDeleted !== 'undefined' && isDeleted !== null) Object.assign(query, { isDeleted });

    return Standards.find(query);
  };

  const ptree = compose(
    createProblemsTree,
    getProblemsByStandardIds,
  );

  let children = [
    getDepartmentsCursorByIds,
    getStandardFiles,
    compose(LessonsLearned.find.bind(LessonsLearned), toDocId),
    compose(Reviews.find.bind(Reviews), toDocIdAndType(DocumentTypes.STANDARD)),
  ];

  children = compose(
    concatC([
      ptree(NonConformities),
      ptree(Risks),
    ]),
    mapC(toObjFind),
  )(children);

  return { find, children };
});

Meteor.publish('standardsDeps', function (organizationId) {
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) return this.ready();

  const actionsQuery = {
    organizationId,
    type: {
      $in: [
        ActionTypes.CORRECTIVE_ACTION,
        ActionTypes.PREVENTATIVE_ACTION,
      ],
    },
  };
  const standardsFields = {
    status: 1,
    viewedBy: 1,
    issueNumber: 1,
    nestingLevel: 1,
    createdAt: 1,
    createdBy: 1,
  };

  const actions = getActionsWithLimitedFields(actionsQuery);
  const departments = Departments.find(
    { organizationId },
    makeOptionsFields(Departments.publicFields),
  );
  const standards = getCursorNonDeleted({ organizationId }, standardsFields, Standards);
  const riskTypes = RiskTypes.find({ organizationId });

  return [
    actions,
    departments,
    standards,
    riskTypes,
  ];
});

publishWithMiddleware(
  ({ counterName, organizationId }) => new Counter(counterName, Standards.find({
    organizationId,
    isDeleted: { $in: [false, null] },
  })),
  {
    name: 'standardsCount',
    middleware: [checkLoggedIn(), checkOrgMembership()],
  },
);

Meteor.publish('standardsNotViewedCount', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);
  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId,
  });
  const query = {
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] },
  };

  if (currentOrgUserJoinedAt) {
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, Standards.find(query));
});
