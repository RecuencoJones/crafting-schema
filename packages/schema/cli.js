import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { validate } from './metaschema.js';
import { load } from './index.js';

async function main(file) {
  const contents = await readFile(resolve(file), 'utf8');

  const schema = load(contents);

  try {
    validate(schema);
    console.log('Schema is valid');
  } catch(e) {
    console.log('Schema is invalid:');
    e.errors.forEach((error) => {
      console.log(`- ${ error.stack }`)
    })
  }

}

main(...process.argv.slice(2));
