import { CollectionNames, ProblemTypes } from '../../constants.js';
import AuditService from '/imports/core/server/audit/audit-service.js';
import ActionUpdateAudit from './ActionUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.ACTIONS,

  _updateAuditConstructor: ActionUpdateAudit,

  _onDocumentCreated(newDocument, userId) {
    const { linkedTo, createdAt, createdBy, sequentialId, title } = newDocument;

    const logs = [];
    const logMessage = `${sequentialId} "${title}" linked`;

    _(linkedTo).each(({ documentId, documentType }) => {
      const collections = {
        [ProblemTypes.NC]: CollectionNames.NCS,
        [ProblemTypes.RISK]: CollectionNames.RISKS
      };

      logs.push({
        documentId,
        collection: collections[documentType],
        message: logMessage,
        date: createdAt,
        executor: createdBy
      });
    });

    this._saveLogs(logs);
  }
});