export const APP_VERSION = '0.3.40';

export const DEFAULT_POLLING_INTERVAL_FOR_COUNTER = 5000; // 5 sec
export const ALERT_AUTOHIDE_TIME = 1500;

export const DocumentTitles = {
  STANDARD: 'Standard',
  NC: 'Nonconformity',
  RISK: 'Risk',
};

export const NonConformityFilters = {
  1: { title: '', name: 'magnitude', prepend: 'by' },
  2: { title: '', name: 'status', prepend: 'by' },
  3: { title: '', name: 'department', prepend: 'by' },
  4: { title: '', name: 'deleted' },
};

export const RiskFilterIndexes = {
  TYPE: 1,
  STATUS: 2,
  DEPARTMENT: 3,
  DELETED: 4,
};

export const RiskFilters = {
  [RiskFilterIndexes.TYPE]: {
    title: 'Risks',
    name: 'type',
    prepend: 'by',
  },
  [RiskFilterIndexes.STATUS]: {
    title: 'Risks',
    name: 'status',
    prepend: 'by',
  },
  [RiskFilterIndexes.DEPARTMENT]: {
    title: 'Risks',
    name: 'department',
    prepend: 'by',
  },
  [RiskFilterIndexes.DELETED]: {
    title: 'Risks',
    name: 'deleted',
  },
};

export const StandardFilters = {
  1: { title: 'Standards', name: 'section', prepend: 'by' },
  2: { title: 'Standards', name: 'type', prepend: 'by' },
  3: { title: 'Standards', name: 'deleted', prepend: '' },
};

export const WorkInboxFilterIndexes = {
  MY_CURRENT: 1,
  TEAM_CURRENT: 2,
  MY_COMPLETED: 3,
  TEAM_COMPLETED: 4,
  MY_DELETED: 5,
  TEAM_DELETED: 6,
};

export const WorkInboxFilters = {
  [WorkInboxFilterIndexes.MY_CURRENT]: { title: 'Work', name: 'my current', prepend: '' },
  [WorkInboxFilterIndexes.TEAM_CURRENT]: { title: 'Work', name: 'team current', prepend: '' },
  [WorkInboxFilterIndexes.MY_COMPLETED]: { title: 'Work', name: 'my completed', prepend: '' },
  [WorkInboxFilterIndexes.TEAM_COMPLETED]: { title: 'Work', name: 'team completed', prepend: '' },
  [WorkInboxFilterIndexes.MY_DELETED]: { name: 'My deleted actions' },
  [WorkInboxFilterIndexes.TEAM_DELETED]: { name: 'Team deleted actions' },
};

export const STANDARD_FILTER_MAP = {
  SECTION: 1,
  TYPE: 2,
  DELETED: 3,
};

export const UncategorizedTypeSection = {
  _id: 'uncategorized',
  title: 'Uncategorized',
  abbreviation: '',
};

export const TruncatedStringLengths = {
  c40: 40,
};

export const StandardsListProjection = {
  organizationId: 1,
  title: 1,
  typeId: 1,
  sectionId: 1,
  nestingLevel: 1,
  viewedBy: 1,
  createdAt: 1,
  owner: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export const RisksListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  typeId: 1,
  scores: 1,
  departmentsIds: 1,
  status: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
  magnitude: 1,
};

export const ActionsListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  linkedTo: 1,
  type: 1,
  status: 1,
  ownerId: 1,
  isCompleted: 1,
  completionTargetDate: 1,
  toBeCompletedBy: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export const NonConformitiesListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  cost: 1,
  ref: 1,
  createdAt: 1,
  magnitude: 1,
  status: 1,
  departmentsIds: 1,
  viewedBy: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export const WorkItemsListProjection = {
  organizationId: 1,
  targetDate: 1,
  type: 1,
  status: 1,
  linkedDoc: 1,
  assigneeId: 1,
  viewedBy: 1,
  createdAt: 1,
  isCompleted: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export const StandardsBookSectionsListProjection = {
  organizationId: 1,
  title: 1,
};

export const StandardTypesListProjection = {
  organizationId: 1,
  title: 1,
};

export const DepartmentsListProjection = {
  organizationId: 1,
  name: 1,
};

export const AnalysisTitles = {
  rootCauseAnalysis: 'Root cause analysis',
  riskAnalysis: 'Initial risk analysis',
  potentialGainAnalysis: 'Potential gain analysis',
  updateOfStandards: 'Final approval to close this nonconformity',
  updateOfRiskRecord: 'Final approval to close this risk',
};

export const AnalysisFieldPrefixes = {
  CAUSE: 'Cause',
  GAIN: 'Gain',
};

export const WorkItemDescriptions = {
  rootCauseAnalysis: 'Complete root cause analysis',
  potentialGainAnalysis: 'Complete potential gain analysis',
  riskAnalysis: 'Complete initial risk analysis',
  updateOfStandards: 'Request for approval to close this nonconformity',
  updateOfRiskRecord: 'Request for approval to close this risk',
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

export const PullMap = {
  left: 'pull-xs-left',
  right: 'pull-xs-right',
  center: 'pull-xs-center',
};

export const TextAlignMap = {
  left: 'text-xs-left',
  right: 'text-xs-right',
  center: 'text-xs-center',
};

export const MarginMap = {
  left: 'margin-left',
  'left-2x': 'margin-left-2x',
  right: 'margin-right',
  'right-2x': 'margin-right-2x',
  bottom: 'margin-bottom',
};

export const UNIQUE_FIELD_MONGO_ERROR_CODE = 11000;
export const MOBILE_BREAKPOINT = 768;

export const FILE_TYPE_MAP = {
  URL: 'url',
  ATTACHMENT: 'attachment',
  VIDEO: 'video',
};

export const ORDER = {
  ASC: 'ACS',
  DESC: 'DECS',
};

export const KeyMap = {
  tab: 9,
  enter: 13,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

export const DEPARTMENT_UNCATEGORIZED = 'DEPARTMENTS.UNCATEGORIZED';

export const UserPresenceStatuses = {
  ONLINE: 'online',
  AWAY: 'away',
  OFFLINE: 'offline',
};

export const TransitionTimeouts = {
  modal: 300,
};

export const TransitionBaseActiveClass = 'in';

export const StatusColors = {
  DEFAULT: 'default',
  AMBER: 'warning',
  RED: 'danger',
  GREEN: 'success',
};

export const StatusColorsHex = {
  AMBER: '#ff8c00',
  DARKER_AMBER: '#e67300',
  RED: '#dc3545',
  DARKER_RED: '#c31c2c',
  GREEN: '#16a916',
};

export const DEFAULT_UPDATE_TIMEOUT = 1200;

export const ApolloFetchPolicies = {
  CACHE_ONLY: 'cache-only',
  CACHE_AND_NETWORK: 'cache-and-network',
  NETWORK_ONLY: 'network-only',
};

export const MilestoneStatusColors = {
  IN_PROGRESS: StatusColorsHex.DARKER_AMBER,
  OVERDUE: StatusColorsHex.DARKER_RED,
  COMPLETED: StatusColorsHex.GREEN,
};

export const ActionStatusColors = {
  IN_PROGRESS: StatusColorsHex.AMBER,
  OVERDUE: StatusColorsHex.RED,
  COMPLETED: StatusColorsHex.GREEN,
};

export const SymbolTypes = {
  DIAMOND: 'diamond',
  SQUARE: 'square',
};

export const TimelineSymbols = {
  MILESTONE: SymbolTypes.DIAMOND,
  ACTION: SymbolTypes.SQUARE,
};

export const Timeline = {
  PART_OF_PAST_TIME: 15 / 100,
  WIDTH: 1140,
  LINE_HEIGHT: 25,
  AXIS_HEIGHT: 20,
  AXIS_OFFSET_Y: 30,
  LIST_ICON_SIZE: 11,
};

export const GQ_ERROR_MESSAGE_PREFIX = 'GraphQL error: ';
export const DEFAULT_ERROR_MESSAGE = 'Internal server error';

export const SUPPORT_FORUM_URL = 'https://gitter.im/Pliohub/SupportForum';

/* eslint-disable max-len */
export const Styles = {
  font: {
    family: {
      segoe: {
        semibold: '"Segoe UI Semibold WestEuropean", "Segoe UI Semibold", "Segoe WP Semibold", "Segoe UI", "Segoe WP", Tahoma, Arial, sans-serif',
        regular: '"Segoe UI Regular WestEuropean", "Segoe UI", "Segoe WP", Tahoma, Arial, sans-serif',
      },
    },
  },
  color: {
    blue: '#0078d7',
    muted: '#818a91',
    lightBlue: '#00BCF2',
    hoverLightBlue: '#59daff',
    white: '#fff',
    lightGrey: '#eee',
    darkGrey: '#373a3c',
  },
};
/* eslint-enable max-len */

export const SUPPORT_EMAIL = 'hello@pliohub.com';

export const GraphQLTypenames = {
  MUTATION: 'Mutation',
  CANVAS_SETTINGS: 'CanvasSettings',
  CANVAS_SECTION_SETTINGS: 'CanvasSectionSettings',
  ORGANIZATION: 'Organization',
};

export const RouteNames = {
  CANVAS: 'canvas',
  DASHBOARD: 'dashboardPage',
  CUSTOMERS: 'customers',
  HELLO: 'hello',
};

export const OptionNone = { label: 'None', value: null };

export const CanvasDoughnutChartSize = {
  WIDTH: 566,
  HEIGHT: 566,
};

export const CanvasBubbleChartSize = {
  WIDTH: 566,
  HEIGHT: 566,
};

export const CriticalityLabels = {
  LOW: 'Low',
  HIGH: 'High',
};
