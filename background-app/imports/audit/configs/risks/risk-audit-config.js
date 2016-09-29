import { Meteor } from 'meteor/meteor';

import { Risks } from '/imports/share/collections/risks.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import { CollectionNames } from '/imports/share/constants.js';
import ProblemAuditConfig from '../problems/problem-audit-config.js';
import RiskWorkflow from '/imports/workflow/RiskWorkflow.js';

import reviewComments from './fields/review.comments.js';
import reviewReviewedAt from './fields/review.reviewedAt.js';
import reviewReviewedBy from './fields/review.reviewedBy.js';
import riskEvaluationComments from './fields/riskEvaluation.comments.js';
import riskEvaluationDecision from './fields/riskEvaluation.decision.js';
import riskEvaluationPrevLossExp from './fields/riskEvaluation.prevLossExp.js';
import riskEvaluationPriority from './fields/riskEvaluation.priority.js';
import scores from './fields/scores.js';
import typeId from './fields/typeId.js';


export default RiskAuditConfig = _.extend({}, ProblemAuditConfig, {

  collection: Risks,

  collectionName: CollectionNames.RISKS,

  workflowConstructor: RiskWorkflow,

  updateHandlers: [
    ...ProblemAuditConfig.updateHandlers,
    reviewComments,
    reviewReviewedAt,
    reviewReviewedBy,
    riskEvaluationComments,
    riskEvaluationDecision,
    riskEvaluationPrevLossExp,
    riskEvaluationPriority,
    scores,
    typeId
  ],

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });
    return Meteor.absoluteUrl(`${serialNumber}/risks/${_id}`);
  }

});
