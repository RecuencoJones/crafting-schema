import { promisify } from 'util';
import yaml from 'js-yaml';
import _deref from 'json-schema-deref';
import { validate } from './metaschema.js';

const deref = promisify(_deref);

export function load(schema) {
  return yaml.load(schema);
}

export async function parse(schema) {
  try {
    const value = load(schema);

    if (!value) {
      return {};
    }

    validate(value);

    const resolved = await deref(value);

    return resolved;
  } catch(err) {
    let message = err.message;

    if (err.errors) {
      message = [
        'Schema is not valid:',
        ...err.errors.map((error) => `- ${ error.stack }`)
      ].join('\n');
    }

    throw new Error(message);
  }
}
