import { applyMiddleware } from 'plio-util';

import checkDocAccess from '../document/checkDocAccess';
import { getCollectionByDocType } from '../../helpers';

export default () => async (next, root, args, context) => applyMiddleware(
  checkDocAccess((_, { rel1: { documentId, documentType } }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  checkDocAccess((_, { rel2: { documentId, documentType } }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
)(next)(root, args, context);
