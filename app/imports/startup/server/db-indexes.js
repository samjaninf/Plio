import {
  RiskTypes,
  Notifications,
  AuditLogs,
  Discussions,
  WorkItems,
  Actions,
  Messages,
  Occurrences,
  NonConformities,
  Standards,
  StandardTypes,
  StandardsBookSections,
  Organizations,
  LessonsLearned,
  Departments,
  Risks,
  Goals,
  Milestones,
  Channels,
  CustomerRelationships,
  CostLines,
  CustomerSegments,
  KeyActivities,
  KeyPartners,
  KeyResources,
  RevenueStreams,
  ValuePropositions,
  CanvasSettings,
  Benefits,
  Features,
  Needs,
  Wants,
  Relations,
} from '../../share/collections';


// indexes for Departments
Departments._ensureIndex({
  organizationId: 1,
});


// indexes for LessonsLearned
LessonsLearned._ensureIndex({
  organizationId: 1,
});

LessonsLearned._ensureIndex({
  documentId: 1,
});


// indexes for Organizations
Organizations._ensureIndex({
  serialNumber: 1,
});

Organizations._ensureIndex({
  name: 1,
}, {
  unique: true,
});

Organizations._ensureIndex({
  'users.userId': 1,
});

Organizations._ensureIndex({
  'users.role': 1,
});

Organizations._ensureIndex({
  'users.isRemoved': 1,
});

Organizations._ensureIndex({
  serialNumber: 1,
  'users.userId': 1,
});

Organizations._ensureIndex({
  'transfer._id': 1,
});


// indexes for StandardsBookSections
StandardsBookSections._ensureIndex({
  organizationId: 1,
});


// indexes for StandardTypes
StandardTypes._ensureIndex({
  organizationId: 1,
});


// indexes for Standards
Standards._ensureIndex({
  organizationId: 1,
});

Standards._ensureIndex({
  isDeleted: 1,
});

Standards._ensureIndex({
  viewedBy: 1,
});

Standards._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

Standards._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
  viewedBy: 1,
});

// indexes for NonConformities
NonConformities._ensureIndex({
  organizationId: 1,
});

NonConformities._ensureIndex({
  isDeleted: 1,
});

NonConformities._ensureIndex({
  viewedBy: 1,
});

NonConformities._ensureIndex({
  title: 1,
});

NonConformities._ensureIndex({
  sequentialId: 1,
});

NonConformities._ensureIndex({
  departmentsIds: 1,
});

NonConformities._ensureIndex({
  standardsIds: 1,
});

NonConformities._ensureIndex({
  status: 1,
});

NonConformities._ensureIndex({
  magnitude: 1,
});

NonConformities._ensureIndex({
  sequentialId: 1,
  title: 1,
});

NonConformities._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});


// indexes for Occurrences
Occurrences._ensureIndex({
  nonConformityId: 1,
});

// indexes for Risks
Risks._ensureIndex({
  organizationId: 1,
});

Risks._ensureIndex({
  isDeleted: 1,
});

Risks._ensureIndex({
  viewedBy: 1,
});

Risks._ensureIndex({
  title: 1,
});

Risks._ensureIndex({
  sequentialId: 1,
});

Risks._ensureIndex({
  scores: 1,
});

Risks._ensureIndex({
  departmentsIds: 1,
});

Risks._ensureIndex({
  standardsIds: 1,
});

Risks._ensureIndex({
  status: 1,
});

Risks._ensureIndex({
  magnitude: 1,
});

Risks._ensureIndex({
  sequentialId: 1,
  title: 1,
});

Risks._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

// Actions indexes

Actions._ensureIndex({
  organizationId: 1,
});

Actions._ensureIndex({
  'linkedTo.documentId': 1,
});

Actions._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

// Work Items indexes

WorkItems._ensureIndex({
  organizationId: 1,
});

WorkItems._ensureIndex({
  'linkedDoc._id': 1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  assigneeId: 1,
  status: 1,
  targetDate: -1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
  createdAt: 1,
  isDeleted: 1,
  viewedBy: 1,
});

// Discussions indexes

Discussions._ensureIndex({
  organizationId: 1,
});

Discussions._ensureIndex({
  linkedTo: 1,
  documentType: 1,
});

// Messages indexes

Messages._ensureIndex({
  organizationId: 1,
});

Messages._ensureIndex({
  discussionId: 1,
});

Messages._ensureIndex({
  createdAt: 1,
});

Messages._ensureIndex({
  discussionId: 1,
  createdAt: 1,
});

Messages._ensureIndex({
  discussionId: 1,
  createdAt: -1,
});

Messages._ensureIndex({
  organizationId: 1,
  discussionId: 1,
  createdAt: 1,
});

// Audit logs indexes

AuditLogs._ensureIndex({
  documentId: 1,
});

AuditLogs._ensureIndex({
  executor: 1,
});

AuditLogs._ensureIndex({
  documentId: 1,
  executor: 1,
});

AuditLogs._ensureIndex({
  documentId: 1,
  date: -1,
});

// Notifications indexes

Notifications._ensureIndex({
  recepientIds: 1,
});

Notifications._ensureIndex({
  recepientIds: 1,
  createdAt: 1,
});

// Risk Types indexes

RiskTypes._ensureIndex({
  organizationId: 1,
});

// Goals indexes

Goals._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

Goals._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
});

Goals._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
  isDeleted: 1,
  priority: 1,
  endDate: 1,
});

// Milestones indexes

Milestones._ensureIndex({
  isDeleted: 1,
});

// Channels indexes

Channels._ensureIndex({
  organizationId: 1,
});

// CustomerRelationships indexes

CustomerRelationships._ensureIndex({
  organizationId: 1,
});

// CostLines indexes

CostLines._ensureIndex({
  organizationId: 1,
});

// CustomerSegments indexes

CustomerSegments._ensureIndex({
  organizationId: 1,
});

// KeyActivities indexes

KeyActivities._ensureIndex({
  organizationId: 1,
});

// KeyPartners indexes

KeyPartners._ensureIndex({
  organizationId: 1,
});

// KeyResources indexes

KeyResources._ensureIndex({
  organizationId: 1,
});

// RevenueStreams indexes

RevenueStreams._ensureIndex({
  organizationId: 1,
});

// ValuePropositions indexes

ValuePropositions._ensureIndex({
  organizationId: 1,
});

// CanvasSettings indexes

CanvasSettings._ensureIndex({
  organizationId: 1,
});

// Customer Elements

Benefits._ensureIndex({
  organizationId: 1,
});

Benefits._ensureIndex({
  'linkedTo.documentId': 1,
});

Features._ensureIndex({
  organizationId: 1,
});

Features._ensureIndex({
  'linkedTo.documentId': 1,
});

Needs._ensureIndex({
  organizationId: 1,
});

Needs._ensureIndex({
  'linkedTo.documentId': 1,
});

Wants._ensureIndex({
  organizationId: 1,
});

Wants._ensureIndex({
  'linkedTo.documentId': 1,
});

// Relations

Relations._ensureIndex({
  'rel1.documentId': 1,
  'rel2.documentType': 1,
});

Relations._ensureIndex({
  'rel1.documentType': 1,
  'rel2.documentId': 1,
});
