export default {
  User: {
    email: ({ emails }) => emails[0].address,
    roles: ({ roles }, { organizationId }) => roles[organizationId],
    isPlioUser: async (root, args, context) => {
      const { _id: userId } = root;
      const { loaders: { Organization: { byQuery } } } = context;
      const organizations = await byQuery.load({ isAdminOrg: true, 'users.userId': userId });
      return !!organizations.length;
    },
  },
  UserProfile: {
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  },
};
