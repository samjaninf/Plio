import DataLoader from 'dataloader';
import sift from 'sift';
import { indexBy, prop, curryN } from 'ramda';

export const batchByQueries = (collection, func) => async (queries) => {
  let docs = await collection.find({ $or: queries }).fetch();
  if (func) docs = await func(docs);
  return queries.map(query => sift(query, docs));
};

export const batchBy = curryN(2, (key, collection, func) => async (keys) => {
  let docs = await collection.find({ [key]: { $in: keys } }).fetch();
  if (func) docs = await func(docs);
  else {
    const indexed = indexBy(prop(key), docs);
    docs = keys.map(k => indexed[k] || null);
  }
  return docs;
});

export const batchByIds = batchBy('_id');

export const createQueryLoader = (collection, func) => new DataLoader(
  batchByQueries(collection, func),
  {
    cacheKeyFn: query => JSON.stringify(query),
  },
);

export const createByIdLoader = (collection, func) => new DataLoader(batchByIds(collection, func), {
  cacheKeyFn: key => key.toString(),
});
