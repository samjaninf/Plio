import { Meteor } from 'meteor/meteor';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const WRITE_PATH = path.resolve(Meteor.absolutePath, '../app/fragmentTypes.json');

fetch(`${Meteor.absoluteUrl()}/graphql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    operationName: '',
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(result => result.json())
  .then((result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );
    // eslint-disable-next-line no-param-reassign
    result.data.__schema.types = filteredData;
    fs.writeFile(WRITE_PATH, JSON.stringify(result.data), (err) => {
      if (err) {
        console.error('Error writing fragmentTypes file', err);
      } else {
        console.log('Fragment types successfully extracted!');
      }
    });
  })
  .catch((err) => {
    console.error('Unable to fetch schema', err);
  });
