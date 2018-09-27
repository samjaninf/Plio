import { T, F } from 'ramda';

import branch from '../branch';

describe('Middleware/helpers/branch', () => {
  const next = jest.fn();
  const middleware1 = jest.fn();
  const middleware2 = jest.fn();

  beforeEach(jest.resetAllMocks);

  it('calls first middleware if predicate passes', async () => {
    await branch(T, middleware1)(next);

    expect(middleware1).toBeCalled();
    expect(middleware2).not.toBeCalled();
    expect(next).not.toBeCalled();
  });

  it('calls second middleware if predicate fails', async () => {
    await branch(F, middleware1, middleware2)(next);

    expect(middleware1).not.toBeCalled();
    expect(middleware2).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it('calls "next" if predicate fails and no second middleware provided', async () => {
    await branch(F, middleware1)(next);

    expect(middleware1).not.toBeCalled();
    expect(middleware2).not.toBeCalled();
    expect(next).toBeCalled();
  });
});
