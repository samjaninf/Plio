import branch from '../helpers/branch';
import checkDocAccess from '../document/checkDocAccess';

export default () => branch(
  (root, args) => args.matchedTo,
  checkDocAccess((root, { matchedTo: { documentId } }, context) => ({
    query: { _id: documentId },
    collection: context.collections.ValuePropositions,
  })),
);
