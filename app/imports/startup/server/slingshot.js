import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Random } from 'meteor/random';

import { HelpDocs, Organizations, NonConformities } from '../../share/collections';
import { isOrgMember, canChangeHelpDocs } from '../../api/checkers';
import { sanitizeFilename } from '../../share/helpers';
import { AWSDirectives } from '../../share/constants';
import Errors from '../../share/errors';

const createPath = (...segments) => segments.join('/');
const createFileName = file => `${Random.id()}-${sanitizeFilename(file.name)}`;
const configureSlingshot = () => {
  const {
    bucketName, acl, userAvatarsDir,
    standardFilesDir, improvementPlanFilesDir,
    nonConformityFilesDir, riskFilesDir,
    actionFilesDir, rootCauseAnalysisFilesDir,
    discussionFilesDir, helpDocsFilesDir,
    goalFilesDir,
  } = Meteor.settings.AWSS3Bucket;

  const contentDisposition = (file) => {
    const fileName = sanitizeFilename(file.name);
    const disposition = 'attachment';
    return `${disposition}; filename="${fileName}"; filename*=utf-8''${fileName}`;
  };

  const config = {
    [AWSDirectives.DISCUSSION_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId, discussionId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          discussionFilesDir,
          discussionId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.USER_AVATARS]: {
      key(file, metaContext) {
        const { userId } = metaContext;
        return createPath(
          userAvatarsDir,
          userId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.STANDARD_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId, standardId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          standardFilesDir,
          standardId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.HTML_ATTACHMENT_PREVIEW]: {
      key(file, metaContext) {
        const { organizationId, standardId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          standardFilesDir,
          standardId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.IMPROVEMENT_PLAN_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          improvementPlanFilesDir,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.NONCONFORMITY_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId, nonConformityId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          nonConformityFilesDir,
          nonConformityId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.RISK_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId, riskId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          riskFilesDir,
          riskId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.ACTION_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId, actionId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          actionFilesDir,
          actionId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.ROOT_CAUSE_ANALYSIS_FILES]: {
      contentDisposition,
      authorize(file, metaContext) {
        if (!this.userId) {
          throw new Meteor.Error(403, Errors.UNAUTHORIZED_CANT_UPLOAD);
        }

        const NC = NonConformities.findOne({ _id: metaContext.nonConformityId });

        if (!NC) {
          throw new Meteor.Error(400, Errors.NOT_FOUND);
        }

        if (!isOrgMember(this.userId, NC.organizationId)) {
          throw new Meteor.Error(403, Errors.UNAUTHORIZED_CANT_UPLOAD);
        }

        return true;
      },
      key(file, metaContext) {
        const { nonConformityId } = metaContext;
        const { organizationId } = NonConformities.findOne({ _id: nonConformityId });

        return createPath(
          'uploads',
          organizationId,
          rootCauseAnalysisFilesDir,
          nonConformityId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.HELP_DOC_FILES]: {
      contentDisposition,
      authorize(file, { helpDocId }) {
        if (!this.userId) {
          throw new Meteor.Error(403, Errors.UNAUTHORIZED_CANT_UPLOAD);
        }

        const helpDoc = HelpDocs.findOne({ _id: helpDocId });
        if (!helpDoc) {
          throw new Meteor.Error(400, Errors.NOT_FOUND);
        }

        if (!canChangeHelpDocs(this.userId)) {
          throw new Meteor.Error(403, Errors.UNAUTHORIZED_CANT_UPLOAD);
        }

        return true;
      },
      key(file, { helpDocId }) {
        const { _id: organizationId } = Organizations.findOne({ isAdminOrg: true });
        return createPath(
          'uploads',
          organizationId,
          helpDocsFilesDir,
          helpDocId,
          createFileName(file),
        );
      },
    },
    [AWSDirectives.GOAL_FILES]: {
      contentDisposition,
      key(file, metaContext) {
        const { organizationId, goalId } = metaContext;
        return createPath(
          'uploads',
          organizationId,
          goalFilesDir,
          goalId,
          createFileName(file),
        );
      },
    },
  };

  Object.keys(config).forEach((key) => {
    Slingshot.createDirective(key, Slingshot.S3Storage, {
      acl,
      bucket: bucketName,
      authorize() {
        if (!this.userId) {
          throw new Meteor.Error(403, Errors.UNAUTHORIZED_CANT_UPLOAD);
        }
        return true;
      },
      ...config[key],
    });
  });
};

// if (Meteor.isProduction) {
configureSlingshot();
// }
