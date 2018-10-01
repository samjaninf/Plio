import resolver from '../users';

describe('Types/Organization/users', () => {
  it('resolves to correct value', async () => {
    const users = [
      { _id: 1 },
      { _id: 2 },
      { _id: 3 },
      { _id: 4 },
    ];
    const root = {
      users: [
        { isRemoved: true, userId: 1 },
        { isRemoved: false, userId: 2 },
        { isRemoved: false, userId: 3 },
        { isRemoved: true, userId: 4 },
      ],
    };
    const context = {
      loaders: {
        User: {
          byQuery: {
            load: () => Promise.resolve(users),
          },
        },
      },
    };

    await expect(resolver(root, {}, context)).resolves.toMatchObject([
      { user: { _id: 2 }, isRemoved: false },
      { user: { _id: 3 }, isRemoved: false },
    ]);
  });
});
