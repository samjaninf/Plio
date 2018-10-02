/* eslint max-len: ["error", 300] */

export const ActionPlanOptions = {
  YES: 'Yes',
  NO: 'No',
  NOT_NEEDED: 'Not needed',
};

export const ActionIndexes = {
  IN_PROGRESS: 1,
  DUE_COMPLETION_TODAY: 2,
  COMPLETION_OVERDUE: 3,
  NOT_YET_VERIFY: 4,
  VERIFY_DUE_TODAY: 5,
  VERIFY_OVERDUE: 6,
  COMPLETED_FAILED: 7,
  COMPLETED_EFFECTIVE: 8,
  COMPLETED: 9,
  DELETED: 10,
};

export const ActionStatuses = {
  [ActionIndexes.IN_PROGRESS]: 'In progress',
  [ActionIndexes.DUE_COMPLETION_TODAY]: 'In progress - due for completion today',
  [ActionIndexes.COMPLETION_OVERDUE]: 'In progress - completion overdue',
  [ActionIndexes.NOT_YET_VERIFY]: 'In progress - completed, not yet verified',
  [ActionIndexes.VERIFY_DUE_TODAY]: 'In progress - completed, verification due today',
  [ActionIndexes.VERIFY_OVERDUE]: 'In progress - completed, verification overdue',
  [ActionIndexes.COMPLETED_FAILED]: 'Completed - failed verification',
  [ActionIndexes.COMPLETED_EFFECTIVE]: 'Completed - verified as effective',
  [ActionIndexes.COMPLETED]: 'Completed',
  [ActionIndexes.DELETED]: 'Deleted',
};

export const ActionTypes = {
  CORRECTIVE_ACTION: 'CA',
  PREVENTATIVE_ACTION: 'PA',
  RISK_CONTROL: 'RC',
  GENERAL_ACTION: 'GA',
};

export const ActionTitles = {
  [ActionTypes.CORRECTIVE_ACTION]: 'Corrective action',
  [ActionTypes.PREVENTATIVE_ACTION]: 'Preventative action',
  [ActionTypes.RISK_CONTROL]: 'Risk control',
  [ActionTypes.GENERAL_ACTION]: 'General action',
};

export const ActionUndoTimeInHours = 1;

export const AnalysisStatuses = {
  0: 'Not completed',
  1: 'Completed',
};

export const ANALYSIS_STATUSES = {
  NOT_COMPLETED: 0,
  COMPLETED: 1,
};

export const AvatarPlaceholders = [
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/1.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/2.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/3.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/4.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/5.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/6.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/7.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/8.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/9.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/10.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/11.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/12.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/13.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/14.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/15.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/16.png',
];

export const DefaultDateFormat = 'MMMM DD, YYYY';

export const PlioS3Logos = {
  square: 'https://s3-eu-west-1.amazonaws.com/plio/images/p-logo-square.png',
};

export const CollectionNames = {
  ACTIONS: 'Actions',
  AUDIT_LOGS: 'AuditLogs',
  CHANGELOG: 'Changelog',
  DEPARTMENTS: 'Departments',
  DISCUSSIONS: 'Discussions',
  FILES: 'Files',
  HELP_DOCS: 'HelpDocs',
  HELP_SECTIONS: 'HelpSections',
  LESSONS: 'LessonsLearned',
  MESSAGES: 'Messages',
  NCS: 'NonConformities',
  NOTIFICATIONS: 'Notifications',
  OCCURRENCES: 'Occurrences',
  ORGANIZATIONS: 'Organizations',
  REVIEWS: 'Reviews',
  RISK_TYPES: 'RiskTypes',
  RISKS: 'Risks',
  STANDARD_TYPES: 'StandardTypes',
  STANDARD_BOOK_SECTIONS: 'StandardsBookSections',
  STANDARDS: 'Standards',
  WORK_ITEMS: 'WorkItems',
  USERS: 'users',
  GOALS: 'Goals',
  MILESTONES: 'Milestones',
  KEY_PARTNERS: 'KeyPartners',
  KEY_ACTIVITIES: 'KeyActivities',
  KEY_RESOURCES: 'KeyResources',
  COST_LINES: 'CostLines',
  CUSTOMER_RELATIONSHIPS: 'CustomerRelationships',
  CHANNELS: 'Channels',
  VALUE_PROPOSITIONS: 'ValuePropositions',
  CUSTOMER_SEGMENTS: 'CustomerSegments',
  REVENUE_STREAMS: 'RevenueStreams',
  CANVAS_SETTINGS: 'CanvasSettings',
  BENEFITS: 'Benefits',
  FEATURES: 'Features',
  NEEDS: 'Needs',
  WANTS: 'Wants',
  RELATIONS: 'Relations',
};

export const DefaultRiskTypes = [
  {
    title: 'Credit risk',
  },
  {
    title: 'Liquidity risk',
  },
  {
    title: 'Market risk',
  },
  {
    title: 'Operational risk',
  },
  {
    title: 'Regulatory risk',
  },
  {
    title: 'Reputational risk',
  },
  {
    title: 'Infosecurity risk',
  },
];

export const DefaultStandardSections = [
  {
    title: 'Introduction',
  },
  {
    title: 'High level standards',
  },
  {
    title: 'Business standards',
  },
];

export const DefaultStandardTypes = {
  PROCESS: {
    title: 'Process',
    abbreviation: 'PRO',
  },
  POLICY: {
    title: 'Policy',
    abbreviation: 'POL',
  },
  CHECKLIST: {
    title: 'Checklist',
    abbreviation: 'CHK',
  },
  COMPLIANCE_MANAGEMENT_OBJECTIVE: {
    title: 'Compliance management objective',
    abbreviation: 'CMO',
  },
  COMPLIANCE_OBLIGATION: {
    title: 'Compliance obligation',
    abbreviation: 'COB',
  },
  STANDARD_OPERATING_PROCEDURE: {
    title: 'Standard operating procedure',
    abbreviation: 'SOP',
  },
  WORK_INSTRUCTION: {
    title: 'Work instruction',
    abbreviation: 'WORK',
  },
  PRODUCT_SPECIFICATION: {
    title: 'Product specification',
    abbreviation: 'SPEC',
  },
  RISK_CONTROL: {
    title: 'Risk control',
    abbreviation: 'RSC',
  },
  SECTION_HEADER: {
    title: 'Section header',
  },
};

export const DocChangesKinds = {
  DOC_CREATED: 1,
  DOC_UPDATED: 2,
  DOC_REMOVED: 3,
};

export const DefaultHelpSections = [
  {
    index: 1,
    title: 'How to get help',
  },
  {
    index: 2,
    title: 'Getting started',
  },
  {
    index: 3,
    title: 'Creating your Standards manual',
  },
  {
    index: 4,
    title: 'Managing risks',
  },
  {
    index: 5,
    title: 'Managing nonconformities',
  },
  {
    index: 6,
    title: 'Managing workflows',
  },
  {
    index: 7,
    title: 'User management',
  },
  {
    index: 8,
    title: 'FAQs',
  },
];

export const InvitationStatuses = {
  failed: 0,
  invited: 1,
  added: 2,
};

export const PhoneTypes = {
  WORK: 'Work',
  HOME: 'Home',
  MOBILE: 'Mobile',
};

export const ProblemMagnitudes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical',
};

export const ProblemIndexes = {
  REPORTED: 1,
  AWAITING_ANALYSIS: 2,
  ACTIONS_TO_BE_ADDED: 3,
  ANALYSIS_DUE_TODAY: 4,
  ANALYSIS_OVERDUE: 5,
  ANALYSIS_COMPLETED_ACTIONS_NEED: 6,
  ANALYSIS_COMPLETED_ACTIONS_IN_PLACE: 7,
  ACTIONS_IN_PLACE: 8,
  ACTIONS_DUE_TODAY: 9,
  ACTIONS_OVERDUE: 10,
  OPEN_ACTIONS_COMPLETED: 11,
  ACTIONS_COMPLETED_WAITING_VERIFY: 12,
  VERIFY_DUE_TODAY: 13,
  VERIFY_PAST_DUE: 14,
  ACTIONS_AWAITING_UPDATE: 15,
  ACTIONS_UPDATE_DUE_TODAY: 16,
  ACTIONS_UPDATE_PAST_DUE: 17,
  ACTIONS_FAILED_VERIFICATION: 18,
  CLOSED_ACTIONS_COMPLETED: 19,
  ACTIONS_VERIFIED_STANDARDS_REVIEWED: 20,
  DELETED: 21,
};

export const ProblemsStatuses = {
  [ProblemIndexes.REPORTED]: 'Open - just reported',
  [ProblemIndexes.AWAITING_ANALYSIS]: 'Open - just reported, awaiting analysis',
  [ProblemIndexes.ACTIONS_TO_BE_ADDED]: 'Open - just reported, action(s) to be added',
  [ProblemIndexes.ANALYSIS_DUE_TODAY]: 'Open - analysis due today',
  [ProblemIndexes.ANALYSIS_OVERDUE]: 'Open - analysis overdue',
  [ProblemIndexes.ANALYSIS_COMPLETED_ACTIONS_NEED]: 'Open - analysis completed, action(s) need to be added',
  [ProblemIndexes.ANALYSIS_COMPLETED_ACTIONS_IN_PLACE]: 'Open - analysis completed, action(s) in place',
  [ProblemIndexes.ACTIONS_IN_PLACE]: 'Open - action(s) in place',
  [ProblemIndexes.ACTIONS_DUE_TODAY]: 'Open - action(s) due today',
  [ProblemIndexes.ACTIONS_OVERDUE]: 'Open - action(s) overdue',
  [ProblemIndexes.OPEN_ACTIONS_COMPLETED]: 'Open - action(s) completed',
  [ProblemIndexes.ACTIONS_COMPLETED_WAITING_VERIFY]: 'Open - action(s) completed, awaiting verification',
  [ProblemIndexes.VERIFY_DUE_TODAY]: 'Open - verification due today',
  [ProblemIndexes.VERIFY_PAST_DUE]: 'Open - verification past due',
  [ProblemIndexes.ACTIONS_AWAITING_UPDATE]: 'Open - action(s) verified as effective, awaiting approval',
  [ProblemIndexes.ACTIONS_UPDATE_DUE_TODAY]: 'Open - action(s) verified as effective, approval due today',
  [ProblemIndexes.ACTIONS_UPDATE_PAST_DUE]: 'Open - action(s) verified as effective, approval past due',
  [ProblemIndexes.ACTIONS_FAILED_VERIFICATION]: 'Open - action(s) failed verification',
  [ProblemIndexes.CLOSED_ACTIONS_COMPLETED]: 'Closed - action(s) completed',
  [ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED]: 'Closed - action(s) verified, approval given, and notification(s) sent to Owner(s) of standard(s) to remind them to update standards',
  [ProblemIndexes.DELETED]: 'Deleted',
};

export const Abbreviations = {
  GOAL: 'KG',
  LESSON: 'LL',
  NONCONFORMITY: 'NC',
  POTENTIAL_GAIN: 'PG',
  BENEFIT: 'BE',
  FEATURE: 'FE',
  NEED: 'NE',
  WANT: 'WA',
};

export const ProblemTypes = {
  NON_CONFORMITY: 'non-conformity',
  RISK: 'risk',
  POTENTIAL_GAIN: 'potential gain',
};

export const CanvasTypes = {
  KEY_PARTNER: 'key-partner',
  KEY_ACTIVITY: 'key-activity',
  KEY_RESOURCE: 'key-resource',
  VALUE_PROPOSITION: 'value-proposition',
  CUSTOMER_RELATIONSHIP: 'customer-relationship',
  CHANNEL: 'channel',
  CUSTOMER_SEGMENT: 'customer-segment',
  COST_LINE: 'cost-line',
  REVENUE_STREAM: 'revenue-stream',
};

export const CanvasSections = {
  [CanvasTypes.KEY_PARTNER]: 'keyPartners',
  [CanvasTypes.KEY_ACTIVITY]: 'keyActivities',
  [CanvasTypes.KEY_RESOURCE]: 'keyResources',
  [CanvasTypes.VALUE_PROPOSITION]: 'valuePropositions',
  [CanvasTypes.CUSTOMER_RELATIONSHIP]: 'customerRelationships',
  [CanvasTypes.CHANNEL]: 'channels',
  [CanvasTypes.CUSTOMER_SEGMENT]: 'customerSegments',
  [CanvasTypes.COST_LINE]: 'costStructure',
  [CanvasTypes.REVENUE_STREAM]: 'revenueStreams',
};

export const CustomerElementTypes = {
  BENEFIT: Abbreviations.BENEFIT,
  FEATURE: Abbreviations.FEATURE,
  NEED: Abbreviations.NEED,
  WANT: Abbreviations.WANT,
};

export const DocumentTypes = {
  STANDARD: 'standard',
  GOAL: 'goal',
  MILESTONE: 'milestone',
  ...ProblemTypes,
  ...ActionTypes,
  ...CanvasTypes,
  ...CustomerElementTypes,
};

export const DocumentTypesPlural = {
  STANDARDS: 'standards',
  NON_CONFORMITIES: 'non-conformities',
  RISKS: 'risks',
  POTENTIAL_GAINS: 'potential gains',
};

export const AllDocumentTypes = {
  ...DocumentTypes,
  DISCUSSION: 'discussion',
};

export const UploaderMetaIdNames = {
  [CanvasTypes.KEY_PARTNER]: 'keyPartnerId',
  [CanvasTypes.KEY_ACTIVITY]: 'keyActivityId',
  [CanvasTypes.KEY_RESOURCE]: 'keyResourceId',
  [CanvasTypes.VALUE_PROPOSITION]: 'valuePropositionId',
  [CanvasTypes.CUSTOMER_RELATIONSHIP]: 'customerRelationshipId',
  [CanvasTypes.CHANNEL]: 'channelId',
  [CanvasTypes.CUSTOMER_SEGMENT]: 'customerSegmentId',
  [CanvasTypes.COST_LINE]: 'costLineId',
  [CanvasTypes.REVENUE_STREAM]: 'revenueStreamId',
  [DocumentTypes.GOAL]: 'goalId',
};

export const ReviewStatuses = {
  0: 'Overdue',
  1: 'Awaiting review',
  2: 'Up-to-date',
};

export const RCAMaxCauses = 5;

export const RiskEvaluationDecisions = {
  tolerate: 'Tolerate',
  treat: 'Treat',
  transfer: 'Transfer',
  terminate: 'Terminate',
};

export const RiskEvaluationPriorities = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const riskScoreTypes = {
  inherent: {
    id: 'inherent',
    label: 'Inherent risk',
    adj: 'Inherent',
  },
  residual: {
    id: 'residual',
    label: 'Residual risk',
    adj: 'Residual',
  },
};

export const SourceTypes = {
  ATTACHMENT: 'attachment',
  URL: 'url',
  VIDEO: 'video',
};

export const StandardStatuses = {
  issued: 'Issued',
  draft: 'Draft',
};

export const StringLimits = {
  abbreviation: {
    min: 1,
    max: 4,
  },
  title: {
    min: 1,
    max: 80,
  },
  longTitle: {
    min: 1,
    max: 120,
  },
  description: {
    max: 500,
  },
  url: {
    min: 1,
    max: 2000,
  },
  comments: {
    min: 1,
    max: 140,
  },
  sequentialId: {
    min: 3,
  },
};

export const SystemName = 'Plio';

export const ReminderTimeUnits = {
  DAYS: 'days',
  WEEKS: 'weeks',
};

export const TimeUnits = {
  ...ReminderTimeUnits,
  MONTHS: 'months',
};

export const UserMembership = {
  ORG_OWNER: 'owner',
  ORG_MEMBER: 'member',
};

export const UserRoles = {
  CREATE_UPDATE_DELETE_STANDARDS: 'create-update-delete-standards',
  CREATE_DELETE_GOALS: 'create-delete-goals',
  VIEW_TEAM_ACTIONS: 'view-team-actions',
  COMPLETE_ANY_ACTION: 'complete-any-action',
  INVITE_USERS: 'invite-users',
  DELETE_USERS: 'delete-users',
  EDIT_USER_ROLES: 'edit-user-roles',
  CHANGE_ORG_SETTINGS: 'change-org-settings',
};

export const UserRolesNames = {
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: 'Create & edit standards documents',
  [UserRoles.CREATE_DELETE_GOALS]: 'Create & delete key goals',
  [UserRoles.VIEW_TEAM_ACTIONS]: 'View all team actions',
  [UserRoles.COMPLETE_ANY_ACTION]: 'Can complete any action',
  [UserRoles.INVITE_USERS]: 'Invite users',
  [UserRoles.DELETE_USERS]: 'Delete users',
  [UserRoles.EDIT_USER_ROLES]: 'Edit user superpowers',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Change organization settings',
};

export const WorkItemTypes = {
  COMPLETE_ACTION: 'complete action',
  VERIFY_ACTION: 'verify action',
  COMPLETE_ANALYSIS: 'complete analysis',
  COMPLETE_UPDATE_OF_DOCUMENTS: 'complete approval',
};

export const WorkItemsStore = {
  TYPES: WorkItemTypes,
  LINKED_TYPES: {
    ...ActionTypes,
    ...ProblemTypes,
  },
  STATUSES: {
    0: 'in progress',
    1: 'due today',
    2: 'overdue',
    3: 'completed',
  },
};

export const WorkItemStatuses = {
  IN_PROGRESS: 0,
  DUE_TODAY: 1,
  OVERDUE: 2,
  COMPLETED: 3,
};

export const WorkflowTypes = {
  THREE_STEP: '3-step',
  SIX_STEP: '6-step',
};

export const OrgOwnerRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
  UserRoles.INVITE_USERS,
  UserRoles.DELETE_USERS,
  UserRoles.EDIT_USER_ROLES,
  UserRoles.CHANGE_ORG_SETTINGS,
  UserRoles.COMPLETE_ANY_ACTION,
  UserRoles.CREATE_DELETE_GOALS,
];

export const OrgMemberRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
  UserRoles.COMPLETE_ANY_ACTION,
  UserRoles.CREATE_DELETE_GOALS,
];

export const OrgCurrencies = {
  EUR: 'EUR',
  GBP: 'GBP',
  USD: 'USD',
};

const getDefaultGuideline = (type, problemType) => (
  `Please go to Organization Settings to define what a ${type} ${problemType} means in your organization.`);

const defaultRiskScoringGuideline = 'Please go to Organization settings and provide a brief summary of how Risks should be scored in your organization.';

export const OrganizationDefaults = {
  workflowDefaults: {
    minorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
    },
    majorProblem: {
      workflowType: WorkflowTypes.SIX_STEP,
      stepTime: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
    },
    criticalProblem: {
      workflowType: WorkflowTypes.SIX_STEP,
      stepTime: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS,
      },
    },
    isActionsCompletionSimplified: true,
  },
  reminders: {
    minorNc: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
    },
    majorNc: {
      start: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 4,
        timeUnit: TimeUnits.DAYS,
      },
    },
    criticalNc: {
      start: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 6,
        timeUnit: TimeUnits.DAYS,
      },
    },
    improvementPlan: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      interval: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS,
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS,
      },
    },
  },
  ncGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.NON_CONFORMITY),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.NON_CONFORMITY),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.NON_CONFORMITY),
  },
  pgGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.POTENTIAL_GAIN),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.POTENTIAL_GAIN),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.POTENTIAL_GAIN),
  },
  rkGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.RISK),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.RISK),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.RISK),
  },
  rkScoringGuidelines: defaultRiskScoringGuideline,
  review: {
    risks: {
      frequency: {
        timeValue: 12,
        timeUnit: TimeUnits.MONTHS,
      },
      reminders: {
        start: {
          timeValue: 2,
          timeUnit: TimeUnits.WEEKS,
        },
        interval: {
          timeValue: 1,
          timeUnit: TimeUnits.WEEKS,
        },
        until: {
          timeValue: 4,
          timeUnit: TimeUnits.WEEKS,
        },
      },
    },
    standards: {
      frequency: {
        timeValue: 12,
        timeUnit: TimeUnits.MONTHS,
      },
      reminders: {
        start: {
          timeValue: 2,
          timeUnit: TimeUnits.WEEKS,
        },
        interval: {
          timeValue: 1,
          timeUnit: TimeUnits.WEEKS,
        },
        until: {
          timeValue: 4,
          timeUnit: TimeUnits.WEEKS,
        },
      },
    },
  },
};

export const StandardTitles = [
  'Standards',
  'Compliance standards',
  'Compliance manual',
  'Quality standards',
  'Quality manual',
];

export const RiskTitles = [
  'Risk register',
  'Risk records',
  'Risks',
];

export const NonConformitiesTitles = [
  'Nonconformities & gains',
  'Exceptions',
];

export const WorkInboxTitles = [
  'Work inbox',
  'Work items',
  'Work',
];

export const HomeScreenTitlesTypes = {
  STANDARDS: 'standards',
  RISKS: 'risks',
  NON_CONFORMITIES: 'nonConformities',
  WORK_INBOX: 'workInbox',
};

export const HomeScreenTitlesTypesLabels = {
  [HomeScreenTitlesTypes.STANDARDS]: 'Standards',
  [HomeScreenTitlesTypes.RISKS]: 'Risk register',
  [HomeScreenTitlesTypes.NON_CONFORMITIES]: 'Nonconformities',
  [HomeScreenTitlesTypes.WORK_INBOX]: 'Work inbox',
};

export const HOME_SCREEN_TITLES = 'homeScreenTitles';

export const EmailsForPlioReporting = [
  'steve.ives@pliohub.com',
  'mike@jssolutionsdev.com',
];

export const FILE_STATUS_MAP = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  TERMINATED: 'terminated',
  FAILED: 'failed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const CustomerTypes = {
  PAYING_SUBSCRIBER: 1,
  FREE_TRIAL: 2,
  TEST_ACCOUNT: 3,
  PAST_CUSTOMER: 4,
};

export const CustomerTypesNames = {
  [CustomerTypes.PAYING_SUBSCRIBER]: 'Paying subscriber',
  [CustomerTypes.FREE_TRIAL]: 'Free trial',
  [CustomerTypes.TEST_ACCOUNT]: 'Test account',
  [CustomerTypes.PAST_CUSTOMER]: 'Past customer',
};

export const PossibleReviewFrequencies = [
  {
    timeValue: 3,
    timeUnit: TimeUnits.DAYS,
  },
  {
    timeValue: 1,
    timeUnit: TimeUnits.WEEKS,
  },
  {
    timeValue: 6,
    timeUnit: TimeUnits.MONTHS,
  },
  {
    timeValue: 12,
    timeUnit: TimeUnits.MONTHS,
  },
  {
    timeValue: 24,
    timeUnit: TimeUnits.MONTHS,
  },
];

export const MessageTypes = {
  TEXT: 'text',
  FILE: 'file',
};

export const WORKSPACE_DEFAULTS = 'workspaceDefaults';

export const WorkspaceDefaultsTypes = {
  DISPLAY_USERS: 'displayUsers',
  DISPLAY_MESSAGES: 'displayMessages',
  DISPLAY_ACTIONS: 'displayActions',
  DISPLAY_GOALS: 'displayGoals',
  DISPLAY_COMPLETED_DELETED_GOALS: 'displayCompletedDeletedGoals',
  TIME_SCALE: 'timeScale',
};

export const WorkspaceDefaults = {
  [WorkspaceDefaultsTypes.DISPLAY_USERS]: 5,
  [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: 1,
  [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: 4,
  [WorkspaceDefaultsTypes.DISPLAY_GOALS]: 10,
  [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: 5,
  [WorkspaceDefaultsTypes.TIME_SCALE]: 3,
};

export const WorkspaceDefaultsLabels = {
  [WorkspaceDefaultsTypes.DISPLAY_USERS]: 'Users online',
  [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: 'Unread messages',
  [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: 'Overdue actions',
  [WorkspaceDefaultsTypes.DISPLAY_GOALS]: 'Key goals displayed by default',
  [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: 'Completed/deleted goals displayed by default',
  [WorkspaceDefaultsTypes.TIME_SCALE]: 'Horizontal scale',
};

export const TimeScaleOptions = [
  {
    label: '1 month',
    value: 1,
  },
  {
    label: '3 months',
    value: 3,
  },
  {
    label: '6 months',
    value: 6,
  },
  {
    label: '9 months',
    value: 9,
  },
  {
    label: '12 months',
    value: 12,
  },
];

export const GoalPriorities = { ...ProblemMagnitudes };

export const GoalStatuses = {
  AWAITING_COMPLETION: 1,
  OVERDUE: 2,
  COMPLETED: 3,
  1: 'Open - awaiting completion',
  2: 'Open - overdue',
  3: 'Closed - marked as complete',
};

export const Colors = {
  PINK: '#F06292',
  PLUM: '#9C27B0',
  PURPLE: '#673AB7',
  INDIGO: '#3F51B5',
  BLUE: '#2196F3',
  LIGHT_BLUE: '#4FC3F7',
  CYAN: '#00BCD4',
  TEAL: '#009688',
  MUTED_PINK: '#F8BBD0',
  MUTED_PLUM: '#CE93D8',
  MUTED_PURPLE: '#B39DDB',
  MUTED_INDIGO: '#9FA8DA',
  MUTED_BLUE: '#90CAF9',
  MUTED_LIGHT_BLUE: '#B3E5FC',
  MUTED_CYAN: '#80DEEA',
  MUTED_TEAL: '#80CBC4',
};

export const GoalColors = { ...Colors };

export const AllowedActionLinkedDocTypes = [
  ...Object.values(ProblemTypes),
  // TODO: allow it only for general actions
  DocumentTypes.GOAL,
];

export const MilestoneStatuses = {
  AWAITING_COMPLETION: 1,
  DUE_TODAY: 2,
  OVERDUE: 3,
  COMPLETED: 4,
  1: 'Open - awaiting completion',
  2: 'Open - due for completion today',
  3: 'Open - completion overdue',
  4: 'Completed',
};

export const AWSDirectives = {
  DISCUSSION_FILES: 'discussionFiles',
  USER_AVATARS: 'userAvatars',
  HTML_ATTACHMENT_PREVIEW: 'htmlAttachmentPreview',
  STANDARD_FILES: 'standardFiles',
  IMPROVEMENT_PLAN_FILES: 'improvementPlanFiles',
  NONCONFORMITY_FILES: 'nonConformityFiles',
  RISK_FILES: 'riskFiles',
  ACTION_FILES: 'actionFiles',
  ROOT_CAUSE_ANALYSIS_FILES: 'rootCauseAnalysisFiles',
  HELP_DOC_FILES: 'helpDocFiles',
  GOAL_FILES: 'goalFiles',
  KEY_PARTNER_FILES: 'keyPartnerFiles',
  KEY_ACTIVITY_FILES: 'keyActivityFiles',
  KEY_RESOURCE_FILES: 'keyResourceFiles',
  VALUE_PROPOSITION_FILES: 'valuePropositionFiles',
  CUSTOMER_RELATIONSHIP_FILES: 'customerRelationshipFiles',
  CHANNEL_FILES: 'channelFiles',
  CUSTOMER_SEGMENT_FILES: 'customerSegmentFiles',
  COST_LINE_FILES: 'costLineFiles',
  REVENUE_STREAM_FILES: 'revenueStreamFiles',
};

export const CRITICALITY_DEFAULT = 30;

export const Criticality = {
  VERY_LOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  VERY_HIGH: 5,
};

export const CriticalityLevels = {
  [Criticality.VERY_LOW]: {
    label: 'Very low',
    max: 20,
  },
  [Criticality.LOW]: {
    label: 'Low',
    max: 40,
  },
  [Criticality.MEDIUM]: {
    label: 'Medium',
    max: 60,
  },
  [Criticality.HIGH]: {
    label: 'High',
    max: 80,
  },
  [Criticality.VERY_HIGH]: {
    label: 'Very high',
    max: 100,
  },
};

export const CanvasColors = { ...Colors };

export const MAX_TOTAL_PERCENT = 100;

export const CustomerElementStatuses = {
  UNMATCHED: 1,
  MATCHED: 2,
  1: 'Unmatched',
  2: 'Matched',
};

export const ImportanceValues = [1, 2, 3, 4, 5];

export const HomeScreenTypes = {
  OPERATIONS: 'operations',
  CANVAS: 'canvas',
};

export const HomeScreenLabels = {
  [HomeScreenTypes.OPERATIONS]: 'Operations view',
  [HomeScreenTypes.CANVAS]: 'Canvas view',
};

export const DEFAULT_ORG_TIMEZONE = 'Europe/London';
